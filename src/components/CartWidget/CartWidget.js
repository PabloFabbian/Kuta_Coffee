import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMugHot } from '@fortawesome/free-solid-svg-icons';
import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';
import { Link } from 'react-router-dom';

const CartWidget = () => {
    const { totalQuantity } = useContext(CartContext);

    return (
        <Link to='./cart-container' className='CartWidget CartItems'>
            <FontAwesomeIcon icon={faMugHot} style={{ color: "#c1cfe6", marginRight: "1vh", height: "14px" }} />
            {totalQuantity} 
        </Link>
    );
}

export default CartWidget;