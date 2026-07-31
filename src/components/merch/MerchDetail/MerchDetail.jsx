import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMerchItem } from '../../../services/firestore';
import { useCart } from '../../../context/CartContext';
import { precio } from '../../../data/site';
import './MerchDetail.css';

const MerchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [item, setItem] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [talle, setTalle] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    let vivo = true;
    setCargando(true);
    getMerchItem(id)
      .then((data) => {
        if (!vivo) return;
        setItem(data);
        // Si hay un solo talle no tiene sentido hacer elegir.
        if (data?.talles?.length === 1) setTalle(data.talles[0]);
      })
      .catch(() => vivo && toast.error('No pudimos cargar el producto.'))
      .finally(() => vivo && setCargando(false));
    return () => {
      vivo = false;
    };
  }, [id]);

  if (cargando) {
    return (
      <main className="k-shell k-section">
        <p className="k-data" style={{ color: 'var(--humo)' }}>Cargando…</p>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="k-shell k-section">
        <h1 className="k-signal" style={{ fontSize: 'clamp(2rem, 8vw, 4rem)' }}>
          Producto no encontrado
        </h1>
        <p style={{ margin: '1rem 0 2rem', color: 'var(--humo)' }}>
          Puede que ya no esté publicado.
        </p>
        <Link to="/merch" className="k-btn">
          Volver a la tienda
        </Link>
      </main>
    );
  }

  const necesitaTalle = item.talles.length > 0;
  const sinStock = item.stock === 0;
  const puedeAgregar = !sinStock && (!necesitaTalle || talle);

  const agregar = () => {
    if (necesitaTalle && !talle) {
      toast.info('Elegí un talle para continuar.');
      return;
    }
    addItem(item, cantidad, talle);
    toast.success(`${item.nombre} agregado al carrito`);
    navigate('/carrito');
  };

  return (
    <main className="detalle k-shell">
      <Link to="/merch" className="k-label detalle__volver">
        ← Tienda
      </Link>

      <div className="detalle__grid">
        <div className="detalle__media">
          {item.imagen ? (
            <img src={item.imagen} alt={item.nombre} />
          ) : (
            <div className="detalle__ph" aria-hidden="true" />
          )}
        </div>

        <div className="detalle__info">
          <h1 className="k-signal detalle__title">{item.nombre}</h1>
          <p className="k-data detalle__precio">{precio(item.precio)}</p>

          {item.descripcion && <p className="detalle__desc">{item.descripcion}</p>}

          {necesitaTalle && (
            <fieldset className="detalle__campo">
              <legend className="k-label">Talle</legend>
              <div className="detalle__talles">
                {item.talles.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`detalle__talle${talle === t ? ' is-active' : ''}`}
                    onClick={() => setTalle(t)}
                    aria-pressed={talle === t}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          <div className="detalle__campo">
            <span className="k-label">Cantidad</span>
            <div className="detalle__stepper">
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                aria-label="Quitar uno"
              >
                −
              </button>
              <span className="k-data">{cantidad}</span>
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.min(item.stock || 99, c + 1))}
                aria-label="Agregar uno"
              >
                +
              </button>
            </div>
          </div>

          <button className="k-btn detalle__add" onClick={agregar} disabled={!puedeAgregar}>
            {sinStock ? 'Sin stock' : 'Agregar al carrito'}
          </button>

          <p className="detalle__envio k-data">
            Retiro sin cargo en Olivos I, Olivos II o Belgrano · Envíos a todo el país
          </p>
        </div>
      </div>
    </main>
  );
};

export default MerchDetail;
