import React from 'react'
import './CartWidget.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMugSaucer } from '@fortawesome/free-solid-svg-icons'

import { useContext } from 'react'
import { CartContext } from '../../context/CartContext'
import { Link } from 'react-router-dom'

const CartWidget = () => {
    const { totalQuantity } = useContext(CartContext)

    return (
        <Link to='./cart' className='CartWidget CartItems' style={{display: totalQuantity > 0 ? 'block' : 'none'}}>
            <FontAwesomeIcon icon={faMugSaucer} style={{color: "#c1cfe6", marginRight: "1vh", height:"14px"}} />
            { totalQuantity }
        </Link>
    )
}

export default CartWidget