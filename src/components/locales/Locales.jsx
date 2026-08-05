import { Link } from 'react-router-dom';
import { LOCALES } from '../../data/locales';
import { estadoLocal } from '../../data/horarios';
import './Locales.css';

/**
 * Los tres locales como recorrido, no como grilla de tarjetas.
 * La línea vertical que une los nodos es el elemento firma del sitio: dice
 * que Kuta es una serie de puntos por los que pasás, no un destino único.
 *
 * Cada parada es además la puerta a su carta: el menú no vive en el navbar
 * porque cada local tiene productos distintos, así que se entra por acá.
 *
 * `compacto` lo usa la home (versión corta, con link al detalle).
 */
const Locales = ({ compacto = false }) => (
  <section className={`locales${compacto ? ' locales--compacto' : ''}`}>
    <div className="k-shell">
      <header className="locales__head">
        <p className="k-label">Dónde estamos</p>

        <div className="locales__head-fila">
          <h2 className="k-signal locales__title">
            {compacto ? 'Tres paradas' : 'Locales'}
          </h2>

          {/* "yendo" dice lo mismo que la línea de paradas, con el trazo de
              ellos. Va acá y no en la home para no competir con el hero. */}
          {!compacto && (
            <img className="locales__yendo" src="/marca/yendo.png" alt="" aria-hidden="true" />
          )}
        </div>
      </header>

      <ol className="locales__linea">
        {LOCALES.map((l) => {
          // null = el local no tiene horarios cargados. En ese caso no
          // mostramos nada: mejor callar que afirmar que está cerrado.
          const estado = estadoLocal(l);

          return (
            <li key={l.id} className="locales__parada">
              <span className="locales__nodo" aria-hidden="true" />

              <div className="locales__parada-body">
                <div className="locales__foto">
                  <img src={l.foto} alt={l.nombre} loading="lazy" />

                  {estado?.abierto && (
                    <img
                      className="locales__cartel"
                      src="/marca/abierto.png"
                      alt="Abierto ahora"
                    />
                  )}
                </div>

                <div className="locales__info">
                  <div className="locales__parada-head">
                    <h3 className="locales__nombre">{l.nombre}</h3>
                    {l.apertura && (
                      <span className="k-data locales__anio">Desde {l.apertura}</span>
                    )}
                  </div>

                  {estado && (
                    <p className={`locales__estado${estado.abierto ? ' is-abierto' : ''}`}>
                      <span className="locales__punto" aria-hidden="true" />
                      {estado.abierto ? 'Abierto ahora' : 'Cerrado'}
                      <span className="k-data locales__estado-detalle">{estado.detalle}</span>
                    </p>
                  )}

                  <p className="k-data locales__dir">
                    {l.calle}
                    <br />
                    {l.barrio}
                  </p>

                  {!compacto && (
                    <>
                      <ul className="locales__horarios">
                        {l.horarios.map((h) => (
                          <li key={h.etiqueta}>
                            <span>{h.etiqueta}</span>
                            <span className="k-data">
                              {h.desde && h.hasta ? `${h.desde} – ${h.hasta}` : 'A confirmar'}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <p className="locales__nota">{l.nota}</p>
                    </>
                  )}

                  <div className="locales__acciones">
                    {/* Acción principal de cada parada: su carta. */}
                    <Link className="k-btn locales__menu" to={`/menu/${l.id}`}>
                      Ver la carta
                    </Link>

                    <a
                      className="locales__maps"
                      href={l.maps}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Cómo llegar →
                    </a>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
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