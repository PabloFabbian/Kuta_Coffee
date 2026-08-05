import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext';
import { precio } from '../../../data/site';
import './CartDrawer.css';

/**
 * Carrito lateral. Se monta una sola vez en App, al lado del Footer.
 *
 * Reemplaza la página /carrito como flujo principal: agregar algo y que la
 * página cambie hace perder el contexto de dónde venía la persona. La ruta
 * /carrito sigue existiendo como fallback para links directos.
 */
const CartDrawer = () => {
  const { cart, setCantidad, removeItem, total, drawerAbierto, cerrarCarrito } = useCart();
  const navigate = useNavigate();
  const cerrarRef = useRef(null);

  // Escape cierra. Es lo que espera cualquiera con un panel abierto.
  useEffect(() => {
    if (!drawerAbierto) return;
    const onKey = (e) => e.key === 'Escape' && cerrarCarrito();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerAbierto, cerrarCarrito]);

  // Bloquea el scroll del fondo mientras el panel está abierto.
  useEffect(() => {
    document.body.style.overflow = drawerAbierto ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerAbierto]);

  // Al abrir, el foco va al botón de cerrar: si no, queda en el botón de
  // "agregar" que está detrás del panel y el teclado navega lo tapado.
  useEffect(() => {
    if (drawerAbierto) cerrarRef.current?.focus();
  }, [drawerAbierto]);

  const irAlCheckout = () => {
    cerrarCarrito();
    navigate('/checkout');
  };

  return (
    <>
      <div
        className={`drawer__fondo${drawerAbierto ? ' is-open' : ''}`}
        onClick={cerrarCarrito}
        aria-hidden="true"
      />

      <aside
        className={`drawer${drawerAbierto ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        aria-hidden={!drawerAbierto}
      >
        <header className="drawer__head">
          <h2 className="drawer__title">Tu carrito</h2>
          <button ref={cerrarRef} className="drawer__cerrar" onClick={cerrarCarrito}>
            <span className="k-sr">Cerrar carrito</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </header>

        {cart.length === 0 ? (
          <div className="drawer__vacio">
            <p>Todavía no agregaste nada.</p>
            <button className="k-btn k-btn--ghost" onClick={cerrarCarrito}>
              Seguir mirando
            </button>
          </div>
        ) : (
          <>
            <ul className="drawer__lista">
              {cart.map((l) => (
                <li key={l.key} className="drawer__linea">
                  {l.imagen ? (
                    <img className="drawer__img" src={l.imagen} alt="" aria-hidden="true" />
                  ) : (
                    <div className="drawer__img drawer__img--ph" aria-hidden="true" />
                  )}

                  <div className="drawer__datos">
                    <h3 className="drawer__nombre">{l.nombre}</h3>
                    {l.talle && <p className="k-data drawer__talle">{l.talle}</p>}

                    <div className="drawer__stepper">
                      <button
                        onClick={() => setCantidad(l.key, l.cantidad - 1)}
                        aria-label={`Quitar uno de ${l.nombre}`}
                      >
                        −
                      </button>
                      <span className="k-data">{l.cantidad}</span>
                      <button
                        onClick={() => setCantidad(l.key, l.cantidad + 1)}
                        aria-label={`Agregar uno de ${l.nombre}`}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="drawer__derecha">
                    <span className="k-data drawer__subtotal">
                      {precio(l.precio * l.cantidad)}
                    </span>
                    <button className="drawer__quitar" onClick={() => removeItem(l.key)}>
                      Quitar
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="drawer__pie">
              <div className="drawer__total">
                <span>Subtotal</span>
                <span className="k-data">{precio(total)}</span>
              </div>
              <p className="drawer__nota">El envío se calcula en el checkout.</p>
              <button className="k-btn drawer__cta" onClick={irAlCheckout}>
                Finalizar compra
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;