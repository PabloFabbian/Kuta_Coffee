import { Link } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';

/**
 * Se muestra sólo si hay algo adentro. Un carrito vacío permanente en la barra
 * sugiere que se pide café por la web, que es justo lo que no queremos.
 */
const CartWidget = () => {
  const { cantidadTotal } = useCart();

  if (cantidadTotal === 0) return null;

  return (
    <Link
      to="/carrito"
      className="cart-widget"
      aria-label={`Ver carrito, ${cantidadTotal} ${cantidadTotal === 1 ? 'artículo' : 'artículos'}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'var(--esmalte)',
        color: 'var(--bone)',
        padding: '0.4rem 0.7rem',
        fontFamily: 'var(--font-data)',
        fontSize: '0.75rem',
        fontWeight: 600,
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
      </svg>
      {cantidadTotal}
    </Link>
  );
};

export default CartWidget;
