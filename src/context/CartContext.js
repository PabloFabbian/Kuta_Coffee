import { createContext, useState } from 'react'

export const CartContext = createContext({
    cart: []
})

export const CartProvider = ({ children }) => {
    const [ cart, setCart ] = useState([])

    console.log(cart)

    const addItem = (item, quantity) => {
        if(!isInCart(item.id)) {
            setCart(prev => [...prev, {...item, quantity}])
        } else {
            console.error('El producto ya fue agregado')
        }
    }

    const clearCart = () => {
        setCart([])
    }

    const isInCart = (itemId) =>{
        return cart.some(prod => prod.id === itemId)
    }

    const onRemove = (id) => {
        const cartUpdated = cart.filter(item => item.id !== id);
        setCart(cartUpdated);
    };

    return(
        <CartContext.Provider value={{cart, addItem, clearCart, onRemove}}>
            { children }
        </CartContext.Provider>
    )
}