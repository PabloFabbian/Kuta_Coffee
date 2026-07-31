import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { precio } from '../../../data/site';
import './Cart.css';

const Cart = () => {
  const { cart, setCantidad, removeItem, total } = useCart();

  if (cart.length === 0) {
    return (
      <main className="carrito k-shell">
        <h1 className="k-signal carrito__title">Carrito</h1>
        <div className="carrito__vacio">
          <p>Todavía no agregaste nada.</p>
          <Link to="/merch" className="k-btn">
            Ver la tienda
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="carrito k-shell">
      <h1 className="k-signal carrito__title">Carrito</h1>

      <ul className="carrito__lista">
        {cart.map((l) => (
          <li key={l.key} className="carrito__linea">
            {l.imagen && <img className="carrito__img" src={l.imagen} alt="" aria-hidden="true" />}

            <div className="carrito__datos">
              <h2 className="carrito__nombre">{l.nombre}</h2>
              {l.talle && <p className="k-data carrito__talle">Talle {l.talle}</p>}
              <button className="carrito__quitar" onClick={() => removeItem(l.key)}>
                Quitar
              </button>
            </div>

            <div className="carrito__stepper">
              <button onClick={() => setCantidad(l.key, l.cantidad - 1)} aria-label={`Quitar uno de ${l.nombre}`}>
                −
              </button>
              <span className="k-data">{l.cantidad}</span>
              <button onClick={() => setCantidad(l.key, l.cantidad + 1)} aria-label={`Agregar uno de ${l.nombre}`}>
                +
              </button>
            </div>

            <span className="k-data carrito__subtotal">{precio(l.precio * l.cantidad)}</span>
          </li>
        ))}
      </ul>

      <div className="carrito__pie">
        <div className="carrito__total">
          <span className="k-label">Total</span>
          <span className="k-data carrito__total-valor">{precio(total)}</span>
          <p className="carrito__total-nota">El envío se calcula en el paso siguiente.</p>
        </div>

        <div className="carrito__acciones">
          <Link to="/merch" className="k-btn k-btn--ghost">
            Seguir mirando
          </Link>
          <Link to="/checkout" className="k-btn">
            Finalizar compra
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Cart;
