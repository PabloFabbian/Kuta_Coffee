import './Item.css'
import { Link } from 'react-router-dom'

const Item = ({ id, name, img, price, stock, description }) => {
    // Truncar descripción si existe
    const shortDescription = description?.length > 70
        ? description.substring(0, 70) + '...'
        : description;

    return (
        <article className="CardItem">
            {/* Imagen con precio badge */}
            <div className="card-image-wrapper">
                <img src={img} alt={name} className="ItemImg" />
                <div className="price-badge">
                    <span className="price-currency">$</span>
                    <span className="price-value">{price}</span>
                </div>
            </div>

            {/* Contenido */}
            <div className="card-content">
                <header className="Header">
                    <h2 className="ItemHeader">{name}</h2>
                </header>

                {shortDescription && (
                    <p className="item-description">{shortDescription}</p>
                )}

                <div className="card-footer-info">
                    <p className="stock-info">
                        <span className="stock-icon">📦</span>
                        Stock: {stock}
                    </p>
                </div>
            </div>

            {/* CTA */}
            <footer className="ItemFooter">
                <Link to={`/item/${id}`} className="Option">
                    <span>Ver detalle</span>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </Link>
            </footer>
        </article>
    )
}

export default Item