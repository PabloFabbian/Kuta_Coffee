import React, { useEffect, useRef, useContext, useState } from 'react';
import { CartContext } from '../../context/CartContext'
import "./CartItem.css"
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../../services/firebase/firebaseConfig'

const CartItem = ({ id, name, price, quantity }) => {
    const { onRemove } = useContext(CartContext);
    const cartItemRef = useRef(null);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        cartItemRef.current.classList.add('fade-in');
        fetchImageUrl();
    });

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

    return (
        <div className="cart-item" ref={cartItemRef}>
            <div className="cart-item-image">
                {imageUrl && <img src={imageUrl} alt="Producto" />}
            </div>
            <div className="cart-item-details">
                <h2>{name}</h2>
                <p>Precio: ${price}</p>
                <p>Cantidad: {quantity}</p>
            </div>
            <div className="cart-item-actions">
                <button onClick={() => onRemove(id)}>
                    Eliminar
                </button>
            </div>
        </div>
    );
};

export default CartItem;