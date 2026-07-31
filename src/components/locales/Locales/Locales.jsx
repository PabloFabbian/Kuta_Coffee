import { Link } from 'react-router-dom';
import { LOCALES } from '../../../data/locales';
import './Locales.css';

/**
 * Los tres locales como recorrido, no como grilla de tarjetas.
 * La línea vertical que une los nodos es el elemento firma del sitio: dice
 * que Kuta es una serie de puntos por los que pasás, no un destino único.
 *
 * `compacto` lo usa la home (versión corta, con link al detalle).
 */
const Locales = ({ compacto = false }) => (
  <section className={`locales${compacto ? ' locales--compacto' : ''}`}>
    <div className="k-shell">
      <header className="locales__head">
        <p className="k-label">Dónde estamos</p>
        <h2 className="k-signal locales__title">
          {compacto ? 'Tres paradas' : 'Locales'}
        </h2>
      </header>

      <ol className="locales__linea">
        {LOCALES.map((l) => (
          <li key={l.id} className="locales__parada">
            <span className="locales__nodo" aria-hidden="true" />

            <div className="locales__parada-body">
              <div className="locales__parada-head">
                <h3 className="locales__nombre">{l.nombre}</h3>
                <span className="k-data locales__anio">Desde {l.apertura}</span>
              </div>

              <p className="k-data locales__dir">
                {l.calle}
                <br />
                {l.barrio}
              </p>

              {!compacto && (
                <>
                  <ul className="locales__horarios">
                    {l.horarios.map((h) => (
                      <li key={h.dias}>
                        <span>{h.dias}</span>
                        <span className="k-data">{h.horas}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="locales__nota">{l.nota}</p>
                </>
              )}

              <a
                className="locales__maps"
                href={l.maps}
                target="_blank"
                rel="noreferrer"
              >
                Abrir en Maps →
              </a>
            </div>
          </li>
        ))}
      </ol>

      {compacto && (
        <Link to="/locales" className="k-btn k-btn--ghost locales__cta">
          Ver horarios de cada local
        </Link>
      )}
    </div>
  </section>
);

export default Locales;
