import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMerch } from '../../../services/firestore';
import { precio } from '../../../data/site';
import './MerchPage.css';

/**
 * Tienda de merch. Esta sí vende: es la parte que reemplaza a Tiendanube.
 */
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

  return (
    <main className="merch">
      <header className="merch__head k-shell">
        <p className="k-label">Tienda</p>
        <h1 className="k-signal merch__title">Merch</h1>
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

        <div className="merch__grid">
          {items.map((item) => (
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
                <h2 className="merch__card-name">{item.nombre}</h2>
                <span className="k-data merch__card-price">{precio(item.precio)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
};

export default MerchPage;
