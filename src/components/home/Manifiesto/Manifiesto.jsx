import { Link } from 'react-router-dom';
import './Manifiesto.css';

/**
 * El argumento de por qué Kuta no es cualquier café: es lo que dice el sticker
 * de la sección. Antes esta sección hablaba de los tres locales, que es de lo
 * que ya habla "Tres paradas" acá abajo.
 *
 * El texto sale de lo que Kuta escribió en LinkedIn: "nos apasiona el café de
 * especialidad, pero elegimos vivirlo de forma relajada, sin pretensiones" y
 * "un buen café no tiene que ser complicado, solo tiene que ser excelente".
 *
 * TODO (Kuta): confirmar el origen del grano y el método de tostado del primer
 * bloque. Es lo único acá que no sale de una fuente propia de ellos.
 */
const BLOQUES = [
  {
    titulo: 'El grano',
    texto:
      'De especialidad, tostado en lotes chicos. Cambiamos el origen según la temporada, así que el café de marzo no es el de septiembre.',
  },
  {
    titulo: 'Quién lo prepara',
    texto:
      'Barra atendida por baristas con experiencia. No es un requisito que negociemos: es la diferencia entre un buen grano y una buena taza.',
  },
  {
    titulo: 'Sin vueltas',
    texto:
      'Especialidad no tiene que significar ceremonia. Pedís, te lo llevás y seguís con tu día. Un buen café no tiene que ser complicado.',
  },
];

const Manifiesto = () => (
  <section className="manifiesto k-section" id="nosotros">
    <div className="k-shell">
      <p className="k-label">Nosotros</p>

      <div className="manifiesto__cabecera">
        <h2 className="k-signal manifiesto__title">
          Un{' '}
          {/* "buen" es la palabra que sostiene la frase: sin ella el titular
              dice cualquier cosa. Va en itálica y con un subrayado trazado a
              mano, que es el gesto de la marca. El SVG es decorativo, así que
              no entra en la lectura del texto. */}
          <span className="manifiesto__resalte">
            <em>buen</em>
            <svg
              className="manifiesto__trazo"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M1.5,7 C16,2.5 32,9 48,5.5 C64,2 80,8.5 98.5,4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </span>{' '}
          café
          <br />
          no tiene que ser
          <br />
          complicado
        </h2>

        {/* El lockup remata el titular: la frase de ellos cierra el argumento
            en su propio trazo. */}
        <img
          className="manifiesto__lockup"
          src="/marca/no-es-cualquier-cafe.png"
          alt="No es cualquier café"
          loading="lazy"
         width={466} height={340} />
      </div>

      <div className="manifiesto__grid">
        {BLOQUES.map((b) => (
          <article key={b.titulo} className="manifiesto__bloque">
            <h3 className="manifiesto__bloque-title">{b.titulo}</h3>
            <p className="manifiesto__bloque-text">{b.texto}</p>
          </article>
        ))}
      </div>

      <div className="manifiesto__cta">
        <Link to="/locales" className="k-btn k-btn--ghost">
          Ver la carta de cada local
        </Link>
        <Link to="/mayorista" className="k-btn k-btn--ghost">
          Vender Kuta en tu local
        </Link>
      </div>
    </div>
  </section>
);

export default Manifiesto;