import React, { useContext, useState } from 'react';
import { collection, getDocs, query, where, writeBatch, addDoc, Timestamp, documentId } from 'firebase/firestore';
import { CartContext } from '../../context/CartContext';
import { db } from '../../services/firebase/firebaseConfig';
import { format } from 'date-fns';
import CheckoutForm from '../CheckoutForm/CheckoutForm';
import './Checkout.css';

const Checkout = () => {
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [orderCart, setOrderCart] = useState([]);
    const [orderTotal, setOrderTotal] = useState(0);
    const { cart, clearCart } = useContext(CartContext);

    const currentDateTime = format(new Date(), 'dd/MM/yyyy HH:mm:ss');

    const createOrder = async ({ name, phone, email }) => {
        setLoading(true);
        try {
            const total = cart.reduce((acc, product) => acc + product.price * product.quantity, 0);
            const objOrder = {
                buyer: { name, phone, email },
                items: cart,
                total,
                date: Timestamp.fromDate(new Date())
            };

            setOrderCart(cart);
            setOrderTotal(total);

            const batch = writeBatch(db);
            const outOfStock = [];
            const ids = cart.map(prod => prod.id);
            const productsRef = collection(db, 'products');
            const productsAddedFromFirestore = await getDocs(query(productsRef, where(documentId(), 'in', ids)));
            const { docs } = productsAddedFromFirestore;

            docs.forEach(doc => {
                const dataDoc = doc.data();
                const stockDb = dataDoc.stock;
                const productAddedToCart = cart.find(prod => prod.id === doc.id);
                const prodQuantity = productAddedToCart?.quantity;

                if (stockDb >= prodQuantity) {
                    batch.update(doc.ref, { stock: stockDb - prodQuantity });
                } else {
                    outOfStock.push({ id: doc.id, ...dataDoc });
                }
            });

            if (outOfStock.length === 0) {
                await batch.commit();
                const orderRef = collection(db, 'orders');
                const orderAdded = await addDoc(orderRef, objOrder);

                setOrderId(orderAdded.id);
                clearCart();
            } else {
                alert('Algunos productos están fuera de stock.');
            }
        } catch (error) {
            console.error('Error al crear la orden:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-fit my-40 text-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-green-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-lg text-gray-600">Se está generando su orden...</p>
            </div>
        );
    }

    if (orderId) {
        return (
            <div className="flex items-center justify-center min-h-fit my-20 relative">
                <div className="w-96 p-6 bg-white rounded-lg shadow-lg">
                    <h1 className="text-2xl font-bold text-center mb-4">¡Orden generada exitosamente!</h1>
                    <div className="border-t border-b border-gray-300 py-4">
                        <h2 className="text-lg font-semibold text-center">Kuta Cafetería, Olivos</h2>
                        <p className="text-center text-sm text-gray-500">Fecha: {currentDateTime}</p>
                        <div className="text-center">
                            <span className="text-sm text-gray-500">ID de la Orden: </span><p className="text-center text-sm text-gray-500 bg-yellow-300 p-1 inline-block rounded">{orderId}</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="font-medium text-gray-700">Resumen de la Compra:</p>
                        <ul className="text-sm text-gray-600 mt-2">
                            {orderCart.map((item) => (
                                <li key={item.id} className="flex justify-between">
                                    <span>{item.quantity}. {item.name}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="mt-4 flex justify-between font-semibold text-gray-700 border-t pt-2">
                        <span>Total</span>
                        <span>${orderTotal.toFixed(2)}</span>
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-6">
                        Gracias por su compra. ¡Esperamos verlo pronto!
                    </p>
                </div>

                <div className="flex gap-4 self-start justify-end ml-4">
                    {orderCart.map((item) => (
                        <div key={item.id} className="image-item rounded-lg shadow-md">
                            <img
                                src={item.img}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                        </div>
                    ))}
                </div>
            </div>

        );
    }

    return (
        <div className="text-center my-20">
            <CheckoutForm onConfirm={createOrder} />
        </div>
    );
};

export default Checkout;