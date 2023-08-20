import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMugSaucer } from '@fortawesome/free-solid-svg-icons'

function CartWidget() {
    return (
        <div className='CartItems'>
            <FontAwesomeIcon icon={faMugSaucer} style={{color: "#c1cfe6", marginRight: "1vh", height:"14px"}} />
            <>0 </>
        </div>
    )
}

export default CartWidget