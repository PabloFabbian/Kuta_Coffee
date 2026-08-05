import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMerch } from '../../../services/firestore';
import { precio } from '../../../data/site';
import './MerchPage.css';

/**
 * Tienda. Dos secciones con la misma grilla pero distinta ficha: el café se
 * elige por perfil de taza y peso, la ropa por talle. Café va primero porque
 * es el producto de la casa.
 */

const SECCIONES = [
  { id: 'cafe', titulo: 'Café en grano', bajada: 'Tostado en lotes chicos. Molido a pedido o en grano entero.' },
  { id: 'merch', titulo: 'Merch', bajada: 'Para llevarte un poco de Kuta puesto.' },
];

const MerchPage = () => {
  const [items, setItems] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let vivo = true;
    getMerch()
      .then((data) => vivo && setItems(data))
      .catch(() => {
        if (!vivo) return;
        setError(true);
        toast.error('No pudimos cargar la tienda. Probá recargar la página.');
      })
      .finally(() => vivo && setCargando(false));
    return () => {
      vivo = false;
    };
  }, []);

  // Solo se muestran las secciones que tienen algo cargado: una sección vacía
  // hace pensar que el sitio está roto.
  const secciones = useMemo(
    () =>
      SECCIONES.map((s) => ({ ...s, items: items.filter((i) => i.categoria === s.id) })).filter(
        (s) => s.items.length > 0
      ),
    [items]
  );

  return (
    <main className="merch">
      <header className="merch__head k-shell">
        <p className="k-label">Tienda</p>

        <div className="merch__titular">
          <h1 className="k-signal merch__title">Llevate Kuta</h1>

          {/* El vaso take away: es literalmente de lo que trata esta página,
              llevarse Kuta puesto. */}
          <img className="merch__vaso" src="/marca/vaso-takeaway.png" alt="" aria-hidden="true" />
        </div>

        <p className="merch__nota">
          Envíos a todo el país o retiro sin cargo en cualquiera de los tres locales.
        </p>
      </header>

      <div className="k-shell">
        {cargando && <p className="merch__estado k-data">Cargando la tienda…</p>}

        {error && !cargando && (
          <p className="merch__estado k-data">La tienda no está disponible ahora mismo.</p>
        )}

        {!cargando && !error && items.length === 0 && (
          <div className="merch__vacio">
            <p className="k-data merch__estado">Todavía no hay productos publicados.</p>
            <Link to="/locales" className="k-btn k-btn--ghost">
              Comprar en el local
            </Link>
          </div>
        )}

        {secciones.map((s) => (
          <section key={s.id} className="merch__seccion">
            <header className="merch__seccion-head">
              <h2 className="k-signal merch__seccion-title">{s.titulo}</h2>
              <p className="merch__seccion-bajada">{s.bajada}</p>
            </header>

            <div className="merch__grid">
              {s.items.map((item) => (
                <Link key={item.id} to={`/merch/${item.id}`} className="merch__card">
                  <div className="merch__card-img">
                    {item.imagen ? (
                      <img src={item.imagen} alt={item.nombre} loading="lazy" />
                    ) : (
                      <div className="merch__card-ph" aria-hidden="true" />
                    )}
                    {item.stock === 0 && <span className="merch__badge">Sin stock</span>}
                  </div>

                  <div className="merch__card-body">
                    {/* El perfil de taza va arriba del nombre: en café de
                        especialidad es lo que decide la compra, más que el
                        nombre de la finca. */}
                    {item.perfil && <p className="merch__card-perfil">{item.perfil}</p>}

                    <h3 className="merch__card-name">{item.nombre}</h3>

                    {item.origen && <p className="merch__card-origen">{item.origen}</p>}

                    <p className="k-data merch__card-pesos">
                      {item.variantes
                        .map((v) => v.label)
                        .filter(Boolean)
                        .join('  ·  ')}
                    </p>

                    <p className="k-data merch__card-price">
                      {item.variosPrecios && <span>Desde </span>}
                      {precio(item.precioDesde)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
};

export default MerchPage;