import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import CartWidget from '../../merch/CartWidget/CartWidget';
import './NavBar.css';

const LINKS = [
  { to: '/locales', label: 'Locales' },
  { to: '/merch', label: 'Tienda' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/mayorista', label: 'Mayorista' },
];

const NavBar = () => {
  const [abierto, setAbierto] = useState(false);
  const { pathname } = useLocation();

  // Cerrar el panel al navegar.
  useEffect(() => setAbierto(false), [pathname]);

  // Bloquear el scroll del fondo mientras el panel está abierto.
  useEffect(() => {
    document.body.style.overflow = abierto ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [abierto]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setAbierto(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="nav">
      <div className="nav__bar">
        <Link to="/" className="nav__brand" aria-label="Kuta, inicio">
          <img src="/kuta.png" alt="" width="96" height="54" />
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
      <div id="nav-panel" className={`nav__panel${abierto ? ' is-open' : ''}`} hidden={!abierto}>
        {LINKS.map((l, i) => (
          <NavLink key={l.to} to={l.to} className="nav__panel-link">
            <span className="k-data nav__panel-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="k-signal">{l.label}</span>
          </NavLink>
        ))}
      </div>
    </header>
  );
};

export default NavBar;
