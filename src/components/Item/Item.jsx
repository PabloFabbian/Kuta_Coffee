import './Item.css'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useCart } from '../../context/CartContext'

const Item = ({ id, name, img, price, stock, description }) => {
    const { addItem, getItemQuantity, removeItem } = useCart()
    const [quantity, setQuantity] = useState(() => getItemQuantity(id) || 0)

    // Truncar descripción para mobile
    const shortDescription = description?.length > 60
        ? description.substring(0, 60) + '...'
        : description

    // Manejar añadir al carrito
    const handleAddToCart = () => {
        if (quantity >= stock) {
            toast.warning('No hay más stock disponible')
            return
        }

        const newQuantity = quantity + 1
        setQuantity(newQuantity)

        const productToAdd = {
            id,
            name,
            price,
            img,
            stock
        }

        addItem(productToAdd, 1)

        toast.success(`✅ ${name} añadido al pedido`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
        })
    }

    // Manejar quitar del carrito
    const handleRemoveFromCart = () => {
        if (quantity <= 0) return

        const newQuantity = quantity - 1
        setQuantity(newQuantity)

        if (newQuantity === 0) {
            removeItem(id)
            toast.info(`🗑️ ${name} eliminado del pedido`, {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
            })
        } else {
            removeItem(id, 1)
        }
    }

    // Manejo específico para desktop
    const handleDesktopAdd = () => {
        if (quantity >= stock) {
            toast.warning('Stock máximo alcanzado')
            return
        }

        const productToAdd = {
            id,
            name,
            price,
            img,
            stock
        }

        addItem(productToAdd, 1)
        setQuantity(prev => prev + 1)

        toast.success(`✅ ${name} añadido al pedido`, {
            position: "top-right",
            autoClose: 2000,
        })
    }

    const handleDesktopRemove = () => {
        if (quantity <= 0) return

        if (quantity === 1) {
            removeItem(id)
            toast.info(`🗑️ ${name} eliminado del pedido`, {
                position: "top-right",
                autoClose: 2000,
            })
        } else {
            removeItem(id, 1)
        }
        setQuantity(prev => prev - 1)
    }

    return (
        <article className="CardItem">
            {/* ===== DISEÑO MOBILE ===== */}
            <div className="mobile-card">
                {/* Imagen a la izquierda */}
                <div className="mobile-image-container">
                    <img src={img} alt={name} className="mobile-item-img" />
                    <div className="mobile-price-badge">
                        <span className="mobile-price">${price}</span>
                    </div>
                </div>

                {/* Contenido a la derecha */}
                <div className="mobile-content">
                    <div className="mobile-header">
                        <h3 className="mobile-title">{name}</h3>
                        {shortDescription && (
                            <p className="mobile-description">{shortDescription}</p>
                        )}
                    </div>

                    {/* Contador tipo PedidosYa */}
                    <div className="mobile-actions">
                        {quantity === 0 ? (
                            <button
                                className="mobile-add-btn"
                                onClick={handleAddToCart}
                                aria-label={`Añadir ${name} al pedido`}
                            >
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="mx-1"
                                >
                                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                </svg>
                            </button>
                        ) : (
                            <div className="quantity-selector">
                                <button
                                    className="quantity-btn minus-btn"
                                    onClick={handleRemoveFromCart}
                                    aria-label="Quitar uno"
                                    disabled={quantity === 0}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 13H5v-2h14v2z" />
                                    </svg>
                                </button>

                                <div className="quantity-display">
                                    <span className="quantity-number">{quantity}</span>
                                    <span className="quantity-label">en mesa</span>
                                </div>

                                <button
                                    className="quantity-btn plus-btn"
                                    onClick={handleAddToCart}
                                    aria-label="Añadir uno más"
                                    disabled={quantity >= stock}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ===== DISEÑO DESKTOP ===== */}
            <div className="desktop-card">
                <div className="card-image-wrapper">
                    <img src={img} alt={name} className="ItemImg" />
                    <div className="price-badge">
                        <span className="price-currency">$</span>
                        <span className="price-value">{price}</span>
                    </div>
                    {quantity > 0 && (
                        <div className="desktop-quantity-indicator">
                            {quantity} {quantity === 1 ? 'unidad' : 'unidades'}
                        </div>
                    )}
                </div>

                <div className="card-content">
                    <header className="Header">
                        <h2 className="ItemHeader">{name}</h2>
                    </header>

                    {description && (
                        <p className="item-description">
                            {description.length > 100 ? description.substring(0, 100) + '...' : description}
                        </p>
                    )}

                    <div className="card-footer-info">
                        <p className="stock-info">
                            <span className="stock-icon">📦</span>
                            Stock: {stock} unidades
                        </p>
                    </div>
                </div>

                <footer className="ItemFooter">
                    {quantity === 0 ? (
                        <button
                            className="Option"
                            onClick={handleDesktopAdd}
                            disabled={stock === 0}
                        >
                            {stock === 0 ? (
                                <span>AGOTADO</span>
                            ) : (
                                <>
                                    <span>Añadir al pedido</span>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 5v14M5 12h14" />
                                    </svg>
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="desktop-quantity-controls">
                            <button
                                className="desktop-quantity-btn minus"
                                onClick={handleDesktopRemove}
                                aria-label="Quitar uno"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14" />
                                </svg>
                            </button>

                            <div className="desktop-quantity-display">
                                <span className="desktop-quantity-number">{quantity}</span>
                                <span className="desktop-quantity-label">añadidos</span>
                            </div>

                            <button
                                className="desktop-quantity-btn plus"
                                onClick={handleDesktopAdd}
                                aria-label="Añadir uno más"
                                disabled={quantity >= stock}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                            </button>
                        </div>
                    )}
                </footer>
            </div>
        </article>
    )
}

export default Item