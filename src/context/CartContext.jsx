import { createContext, useState, useContext } from 'react'

export const CartContext = createContext({
    cart: [],
    totalQuantity: 0,
    addItem: () => { },
    removeItem: () => { },
    clearCart: () => { },
    onRemove: () => { },
    isInCart: () => { },
    getItemQuantity: () => { },
    getTotalPrice: () => { }
})

// Custom hook para usar el contexto
export const useCart = () => {
    const context = useContext(CartContext)

    if (!context) {
        throw new Error('useCart debe usarse dentro de un CartProvider')
    }

    return context
}

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([])

    console.log('🛒 Estado actual del carrito:', cart)

    const addItem = (item, quantity) => {
        if (!isInCart(item.id)) {
            // Si no está en el carrito, lo agregamos
            setCart(prev => [...prev, { ...item, quantity }])
        } else {
            // Si ya está, actualizamos la cantidad sumando
            const cartUpdated = cart.map(prod => {
                if (prod.id === item.id) {
                    return { ...prod, quantity: prod.quantity + quantity }
                } else {
                    return prod
                }
            })
            setCart(cartUpdated)
        }
    }

    const removeItem = (itemId, quantity = 1) => {
        const cartUpdated = cart.map(prod => {
            if (prod.id === itemId) {
                const newQuantity = prod.quantity - quantity
                if (newQuantity <= 0) {
                    // Si la cantidad llega a 0 o menos, eliminamos el producto
                    return null
                }
                return { ...prod, quantity: newQuantity }
            }
            return prod
        }).filter(prod => prod !== null) // Filtramos los nulls

        setCart(cartUpdated)
    }

    const clearCart = () => {
        setCart([])
    }

    const isInCart = (itemId) => {
        return cart.some(prod => prod.id === itemId)
    }

    const onRemove = (id) => {
        const cartUpdated = cart.filter(item => item.id !== id);
        setCart(cartUpdated);
    };

    const getItemQuantity = (itemId) => {
        const item = cart.find(prod => prod.id === itemId)
        return item ? item.quantity : 0
    }

    const getTotalPrice = () => {
        return cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
    }

    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <CartContext.Provider value={{
            cart,
            addItem,
            removeItem,
            clearCart,
            onRemove,
            isInCart,
            getItemQuantity,
            getTotalPrice,
            totalQuantity
        }}>
            {children}
        </CartContext.Provider>
    )
}