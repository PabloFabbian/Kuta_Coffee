import { CartContext } from '../../context/CartContext'
import ItemCount from '../ItemCount/ItemCount'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import './ItemDetail.css'

const ItemDetail = ({ id, name, img, category, description, price, stock }) => {
    const[quantityAdded, setQuantityAdded] = useState(0)
    const { addItem } = useContext(CartContext)

    const handleOnAdd = (quantity) => {
        setQuantityAdded(quantity)

        const item = {
            id, name, price
        }

        addItem (item, quantity)
    }

    return (
        <article className="CardItem">
            <header className="Header">
                <h2 className="ItemHeader">
                    {name}
                </h2>
            </header>
            <picture>
                <img src={img} alt={name} className="ItemImg"/>
            </picture>
            <section>
                <p className="Info">
                    Categoria: {category}
                </p>
                <p className="Info">
                    Descripción: {description}
                </p>
                <p className="Info">
                    Precio: ${price}
                </p>
            </section>
            <footer className="ItemFooter">
                {quantityAdded > 0
                ? ( <div>
                        <button className="Option continue-shopping-button" onClick={() => window.history.back()}>
                            Agregar + productos
                        </button>
                        <Link to="/cart" className="Option">
                            Terminar compra
                        </Link>
                    </div>)
                : ( <ItemCount initial={1} stock={stock} onAdd={handleOnAdd} />)}
            </footer>
        </article>
    )
}

export default ItemDetail