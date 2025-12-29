import React, { useEffect, useRef, useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/firebase/firebaseConfig';
import "./CartItem.css";

const CartItem = ({ id, name, price, quantity }) => {
    const { onRemove, updateQuantity } = useContext(CartContext);
    const cartItemRef = useRef(null);
    const [imageUrl, setImageUrl] = useState('');
    const [tempQuantity, setTempQuantity] = useState(quantity);
    const [confirming, setConfirming] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    useEffect(() => {
        cartItemRef.current.classList.add('fade-in');
        fetchImageUrl();
    }, []);

    const fetchImageUrl = async () => {
        try {
            const docSnap = await getDoc(doc(db, 'products', id));
            if (docSnap.exists()) {
                const data = docSnap.data();
                setImageUrl(data.img);
            }
        } catch (error) {
            console.error('Error fetching image URL:', error);
        }
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 0 && newQuantity <= 6) {
            setTempQuantity(newQuantity);
            setConfirming(true);
        }
    };

    const confirmChange = async () => {
        setShowConfirmDialog(false);
        try {
            const productRef = doc(db, 'products', id);
            const productSnap = await getDoc(productRef);

            if (productSnap.exists()) {
                const currentStock = productSnap.data().stock;

                if (tempQuantity <= currentStock) {
                    await updateDoc(productRef, {
                        stock: currentStock - (tempQuantity - quantity)
                    });
                    updateQuantity(id, tempQuantity);
                } else {
                    alert('No hay suficiente stock');
                }
            }
        } catch (error) {
            console.error('Error updating stock:', error);
        } finally {
            setConfirming(false);
        }
    };

    const cancelChange = () => {
        setTempQuantity(quantity);
        setConfirming(false);
    };

    return (
        <div className="cart-item" ref={cartItemRef}>
            <div className="cart-item-image">
                {imageUrl && <img src={imageUrl} alt="Producto" />}
            </div>
            <div className="cart-item-details">
                <h2>{name}</h2>
                <p>Precio: ${price}</p>
                <div className="quantity-controls">
                    <button onClick={() => handleQuantityChange(tempQuantity - 1)} disabled={tempQuantity <= 0}>
                        -
                    </button>
                    <span>{tempQuantity}</span>
                    <button onClick={() => handleQuantityChange(tempQuantity + 1)} disabled={tempQuantity >= 6}>
                        +
                    </button>
                    {confirming && (
                        <div className="confirm-actions">
                            <span onClick={() => setShowConfirmDialog(true)} className="check-icon">✔</span>
                            <span onClick={cancelChange} className="cross-icon">✖</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="cart-item-actions">
                <button onClick={() => onRemove(id)}>
                    Eliminar
                </button>
            </div>

            {showConfirmDialog && (
                <div className="confirm-dialog">
                    <p>¿Confirmar [ {tempQuantity} ] {name}?</p>
                    <button onClick={() => setShowConfirmDialog(false)} className="cancel-button">Cancelar</button>
                    <button onClick={confirmChange} className="confirm-button">Confirmar</button>
                </div>
            )}
        </div>
    );
};

export default CartItem;