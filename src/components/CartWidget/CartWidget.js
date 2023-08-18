import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMugSaucer } from '@fortawesome/free-solid-svg-icons'

function CartWidget() {
    return (
        <div className='CartItems'>
            <FontAwesomeIcon icon={faMugSaucer} style={{color: "#c1cfe6", marginTop: "5.5px"}} />
            <> 0</>
        </div>
    )
}

export default CartWidget