import { Link } from 'react-router-dom';
import { LOCALES } from '../../../data/locales';
import { SITE } from '../../../data/site';
import './Footer.css';

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

const Footer = () => (
  <footer className="pie">
    <div className="k-shell pie__grid">
      <div className="pie__marca">
        <img src="/kuta.png" alt="Kuta" className="pie__logo" />
        <p className="pie__claim">{SITE.claim}</p>
      </div>

      <nav className="pie__col" aria-label="Secciones">
        <h2 className="k-label">Sitio</h2>
        <Link to="/menu">Menú</Link>
        <Link to="/merch">Tienda</Link>
        <Link to="/locales">Locales</Link>
        <Link to="/mayorista">Mayorista</Link>
      </nav>

      <div className="pie__col">
        <h2 className="k-label">Locales</h2>
        {LOCALES.map((l) => (
          <a key={l.id} href={l.maps} target="_blank" rel="noreferrer" className="k-data pie__local">
            <strong>{l.nombre}</strong>
            {l.calle}
          </a>
        ))}
      </div>

      <div className="pie__col">
        <h2 className="k-label">Contacto</h2>
        <a href={`mailto:${SITE.email}`} className="k-data">
          {SITE.email}
        </a>
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noreferrer"
          className="pie__social"
        >
          <InstagramIcon />
          @kuta_cafe
        </a>
      </div>
    </div>

    <div className="pie__base">
      <div className="k-shell pie__base-inner">
        <span className="k-data">
          © {new Date().getFullYear()} {SITE.nombre} · {SITE.bajada}
        </span>
        <span className="k-data pie__credito">
          Sitio por{' '}
          <a href="https://pfsoftware.com.ar" target="_blank" rel="noreferrer">
            PF Software
          </a>
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
