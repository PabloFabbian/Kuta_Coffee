import './Reconocimiento.css';

/**
 * Franja de reconocimiento en la home.
 *
 * Kuta postea esto en LinkedIn pero no lo puede mostrar en ningún canal
 * propio. Va apenas pasado el hero: es lo que le da autoridad al resto del
 * sitio ante alguien que llega por primera vez.
 *
 * Va sobre --lime-cream, el color más saturado de la paleta, entre el hero
 * oscuro y el Manifiesto claro. Es el único bloque del sitio con ese fondo, y
 * esa unicidad es lo que lo hace leer como destacado y no como una sección más.
 *
 * Dice "nominada", no "ganadora", porque eso es lo que dice el anuncio. Si el
 * sitio infla el dato y alguien lo verifica, el efecto se da vuelta justo en
 * la sección que busca dar confianza.
 */
const Reconocimiento = () => (
  <aside className="reco" aria-label="Reconocimiento">
    <div className="k-shell reco__inner">
      {/* El sello de Kuta en vez de una medalla genérica: el reconocimiento
          se lee como propio de la marca, no como un badge de plantilla. */}
      <img className="reco__sello" src="/marca/sello.png" alt="" aria-hidden="true" />

      <div className="reco__texto">
        <p className="reco__label">Reconocimiento</p>
        <p className="reco__titulo">
          Nominada a <em>The Best Coffee Shops Argentina</em>
        </p>
        <p className="reco__pie">
          Entre los mejores cafés de especialidad del país.
        </p>
      </div>

      <span className="reco__anio k-data" aria-hidden="true">
        2026
      </span>
    </div>
  </aside>
);

export default Reconocimiento;