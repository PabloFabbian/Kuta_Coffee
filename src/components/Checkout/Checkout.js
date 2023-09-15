import { CartContext } from '../../context/CartContext';
import { useContext, useState } from 'react';
import { collection, getDocs, query, where, writeBatch, addDoc, Timestamp, documentId } from 'firebase/firestore'
import { db } from '../../services/firebase/firebaseConfig';

import CheckoutForm from '../CheckoutForm/CheckoutForm';
import './Checkout.css'

const Checkout = () => {
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState('');

    const { cart, clearCart } = useContext(CartContext);

    const createOrder = async ({ name, phone, email }) => {
        setLoading(true);

        try {
            const total = cart.reduce((acc, product) => {
                return acc + (product.price * product.quantity);
            }, 0);
            
            const objOrder = {
                buyer: { name, phone, email, },
                items: cart,
                total: total,
                date: Timestamp.fromDate(new Date())
            };

            const batch = writeBatch(db)

            const outOfStock = []

            const ids = cart.map(prod => prod.id)

            const productsRef = collection(db, 'products')

            const productsAddedFromFirestore = await getDocs(query(productsRef, where(documentId(), 'in', ids)))

            const { docs } = productsAddedFromFirestore

            docs.forEach(doc => {
                const dataDoc = doc.data()
                const stockDb = dataDoc.stock

                const productAddedToCart = cart.find(prod => prod.id === doc.id)
                const prodQuantity = productAddedToCart?.quantity

                if(stockDb >= prodQuantity) {
                    batch.update(doc.ref, { stock: stockDb - prodQuantity })
                } else {
                    outOfStock.push({ id: doc.id, ...dataDoc })
                }
            })

            if(outOfStock.length === 0) {
                await batch.commit()

                const orderRef = collection(db, 'orders')
            
                const orderAdded = await addDoc(orderRef, objOrder)

                setOrderId(orderAdded.id)
                clearCart()
            } else {
                toast.warn('🦄 ¡Producto fuera de Stock!', {
                    position: "bottom-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    })
            }
        
        } catch(error) {
            toast.error('🦄 ¡Ocurrió un error inesperado!', {
                position: "bottom-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                })
        } finally {
            setLoading(false)
        }
    
    }

    if (loading) {
        return <div className="centered-content"><h1>Se está generando su orden...</h1></div>;
    }
    
    if (orderId) {
        return <div className="centered-content"><h1>El ID de su Orden es: {orderId}</h1></div>;
    }
    
    return (
        <div>
            <div className="centered-content">
                <h1>Checkout</h1>
            </div>
            <CheckoutForm onConfirm={createOrder} />
        </div>
    );
}

export default Checkout;