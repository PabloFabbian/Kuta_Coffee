import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'

function CartWidget() {
    return (
        <div className='CartItems'>
            <FontAwesomeIcon icon={faCartShopping} style={{color: "#c1cfe6",}} />
            0
        </div>
    )
}

export default CartWidget