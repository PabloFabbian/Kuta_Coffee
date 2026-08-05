import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import CartWidget from '../../merch/CartWidget/CartWidget';
import './NavBar.css';

/**
 * El menú de cafetería no está acá a propósito: cada local tiene su propia
 * carta, así que se entra por Locales.
 */
const LINKS = [
  { to: '/locales', label: 'Locales' },
  { to: '/merch', label: 'Tienda' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/mayorista', label: 'Mayorista' },
];

const NavBar = () => {
  const [abierto, setAbierto] = useState(false);
  const { pathname } = useLocation();
  const panelRef = useRef(null);
  const toggleRef = useRef(null);
  // Guarda si el panel estuvo abierto, para devolver el foco sólo cuando
  // corresponde y no robárselo a la página en la carga inicial.
  const estuvoAbierto = useRef(false);

  const cerrar = useCallback(() => setAbierto(false), []);

  // Cerrar al navegar.
  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  // Bloquear el scroll del fondo mientras el panel está abierto.
  useEffect(() => {
    document.body.style.overflow = abierto ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [abierto]);

  /**
   * Foco encerrado dentro del panel.
   *
   * Sin esto, al tabular desde el panel abierto el foco se va al contenido de
   * atrás, que está tapado: quien navega con teclado queda recorriendo links
   * que no ve. Al cerrar, el foco vuelve al botón que lo abrió.
   */
  useEffect(() => {
    if (!abierto) {
      if (estuvoAbierto.current) toggleRef.current?.focus();
      return undefined;
    }

    estuvoAbierto.current = true;
    const enfocables = panelRef.current?.querySelectorAll('a[href], button');
    /**
     * Dos frames de espera antes de enfocar.
     *
     * El panel arranca con visibility:hidden y enfocar algo invisible falla
     * en silencio. Un solo requestAnimationFrame no alcanza: corre antes del
     * repintado, cuando el estilo nuevo todavía no se aplicó. El segundo cae
     * ya con el panel visible.
     */
    let frame2;
    const frame1 = requestAnimationFrame(() => {
      frame2 = requestAnimationFrame(() => enfocables?.[0]?.focus());
    });

    const onKey = (e) => {
      if (e.key === 'Escape') {
        cerrar();
        return;
      }
      if (e.key !== 'Tab' || !enfocables?.length) return;

      const primero = enfocables[0];
      const ultimo = enfocables[enfocables.length - 1];

      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(frame1);
      cancelAnimationFrame(frame2);
      window.removeEventListener('keydown', onKey);
    };
  }, [abierto, cerrar]);

  return (
    <>
      {/* Primer tabulado de la página: saltea la navegación entera. */}
      <a className="nav__saltar" href="#contenido">
        Saltar al contenido
      </a>

      <header className="nav">
        <div className="nav__bar">
          <Link to="/" className="nav__brand" aria-label="Kuta, inicio">
            <img src="/kuta.png" alt="" width="275" height="136" />
          </Link>

          <nav className="nav__links" aria-label="Principal">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="nav__actions">
            <CartWidget />
            <button
              ref={toggleRef}
              type="button"
              className={`nav__toggle${abierto ? ' is-open' : ''}`}
              onClick={() => setAbierto((v) => !v)}
              aria-expanded={abierto}
              aria-controls="nav-panel"
            >
              <span className="k-sr">{abierto ? 'Cerrar menú' : 'Abrir menú'}</span>
              <span className="nav__bun" aria-hidden="true" />
              <span className="nav__bun" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Panel mobile: la lista se lee como un tablero de andén. */}
        <div
          id="nav-panel"
          ref={panelRef}
          className={`nav__panel${abierto ? ' is-open' : ''}`}
          inert={abierto ? undefined : ''}
          aria-hidden={!abierto}
        >
          <nav className="nav__panel-lista" aria-label="Principal, móvil">
            {LINKS.map((l, i) => (
              <NavLink key={l.to} to={l.to} className="nav__panel-link">
                <span className="k-data nav__panel-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="k-signal">{l.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
};

export default NavBar;