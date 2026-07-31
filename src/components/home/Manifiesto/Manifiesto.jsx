import { Link } from 'react-router-dom';
import './Manifiesto.css';

/**
 * Reemplaza al viejo <Story />, que afirmaba "más de una década" y "5000+
 * clientes felices". Kuta abrió en 2021 y esos números no salían de ningún
 * lado: en un sitio de cliente, un dato inventado es un pasivo.
 *
 * TODO (Kuta): confirmar origen del café y método de tostado para el bloque
 * "De dónde sale". Mientras tanto queda en términos generales.
 */
const BLOQUES = [
  {
    titulo: 'De dónde sale',
    texto:
      'Grano de especialidad, tostado en lotes chicos. Cambiamos el origen según la temporada, así que el café de marzo no es el de septiembre.',
  },
  {
    titulo: 'Cómo se sirve',
    texto:
      'Barra corta y rápida. La mayoría de lo que hacemos sale para llevar, y está pensado para que aguante el viaje sin arruinarse.',
  },
  {
    titulo: 'Dónde estamos',
    texto:
      'Dos locales en Olivos y uno en Belgrano. Mismo café, misma receta, tres puntos distintos del recorrido.',
  },
];

const Manifiesto = () => (
  <section className="manifiesto k-section" id="nosotros">
    <div className="k-shell">
      <p className="k-label">Nosotros</p>

      <h2 className="k-signal manifiesto__title">
        Tres locales,
        <br />
        una sola receta
      </h2>

      <div className="manifiesto__grid">
        {BLOQUES.map((b) => (
          <article key={b.titulo} className="manifiesto__bloque">
            <h3 className="manifiesto__bloque-title">{b.titulo}</h3>
            <p className="manifiesto__bloque-text">{b.texto}</p>
          </article>
        ))}
      </div>

      <div className="manifiesto__cta">
        <Link to="/menu" className="k-btn k-btn--ghost">
          Ver la carta completa
        </Link>
        <Link to="/mayorista" className="k-btn k-btn--ghost">
          Vender Kuta en tu local
        </Link>
      </div>
    </div>
  </section>
);

export default Manifiesto;
