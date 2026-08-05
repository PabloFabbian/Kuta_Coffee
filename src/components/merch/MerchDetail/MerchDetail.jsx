import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMerch } from '../../../services/firestore';
import { useCart } from '../../../context/CartContext';
import { precio } from '../../../data/site';
import './MerchDetail.css';

/** Orden fijo de la ficha: se lee siempre igual entre un café y otro. */
const FICHA = [
  ['origen', 'Origen'],
  ['productor', 'Productor'],
  ['variedad', 'Variedad'],
  ['finca', 'Finca'],
  ['proceso', 'Proceso'],
  ['altura', 'Altura'],
];

const MerchDetail = () => {
  const { id } = useParams();
  const { addItem } = useCart();

  const [todos, setTodos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [variante, setVariante] = useState(null);
  const [molienda, setMolienda] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [activa, setActiva] = useState(0);

  // Una sola lectura trae el producto y los relacionados. Con un catálogo de
  // este tamaño sale más barato que pedir el documento y después la colección.
  useEffect(() => {
    let vivo = true;
    setCargando(true);
    getMerch()
      .then((data) => vivo && setTodos(data))
      .catch(() => vivo && toast.error('No pudimos cargar el producto.'))
      .finally(() => vivo && setCargando(false));
    return () => {
      vivo = false;
    };
  }, []);

  const item = useMemo(() => todos.find((p) => p.id === id) ?? null, [todos, id]);

  const relacionados = useMemo(
    () => todos.filter((p) => p.id !== id && p.categoria === item?.categoria).slice(0, 3),
    [todos, id, item]
  );

  // Al cambiar de producto se reinicia la selección.
  useEffect(() => {
    setActiva(0);
    setCantidad(1);
    if (!item) return;
    const vs = item.variantes ?? [];
    setVariante(vs.length === 1 ? vs[0] : vs.find((v) => v.stock > 0) ?? vs[0] ?? null);
    setMolienda('');
  }, [item]);

  const imagenes = useMemo(() => {
    if (!item) return [];
    return (item.imagenes?.length ? item.imagenes : [item.imagen]).filter(Boolean);
  }, [item]);

  const fichaFilas = useMemo(
    () => (item ? FICHA.filter(([k]) => item.ficha?.[k]) : []),
    [item]
  );

  if (cargando) {
    return (
      <main className="k-shell k-section">
        <p className="k-data" style={{ color: 'var(--texto-suave)' }}>Cargando…</p>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="k-shell k-section">
        <h1 className="k-signal" style={{ fontSize: 'clamp(2rem, 8vw, 4rem)' }}>
          Producto no encontrado
        </h1>
        <p style={{ margin: '1rem 0 2rem', color: 'var(--texto-suave)' }}>
          Puede que ya no esté publicado.
        </p>
        <Link to="/merch" className="k-btn">
          Volver a la tienda
        </Link>
      </main>
    );
  }

  const tieneOpciones = item.variantes.length > 1 || Boolean(item.variantes[0]?.label);
  const necesitaMolienda = item.molienda.length > 0;
  const sinStock = item.stock === 0;
  const varianteSinStock = variante ? variante.stock === 0 : true;
  const etiquetaOpcion = item.categoria === 'cafe' ? 'Tamaño' : 'Talle';

  const agregar = () => {
    if (!variante) return;
    if (necesitaMolienda && !molienda) {
      toast.info('Elegí si lo querés en grano o molido.');
      return;
    }
    // La molienda se compone con la etiqueta de la variante. Así llega al
    // carrito, al pedido y al título de Mercado Pago sin tocar el contexto.
    const etiqueta = [variante.label, molienda].filter(Boolean).join(' · ');
    addItem(
      { ...item, precio: variante.precio, stock: variante.stock },
      cantidad,
      etiqueta || null
    );
  };

  return (
    <main className="detalle k-shell">
      <nav className="detalle__miga k-data" aria-label="Migas de pan">
        <Link to="/">Inicio</Link>
        <span aria-hidden="true">·</span>
        <Link to="/merch">Tienda</Link>
        <span aria-hidden="true">·</span>
        <span aria-current="page">{item.nombre}</span>
      </nav>

      <div className="detalle__grid">
        <div className="detalle__galeria">
          {imagenes.length > 1 && (
            <ul className="detalle__minis" aria-label="Imágenes del producto">
              {imagenes.map((src, i) => (
                <li key={src + i}>
                  <button
                    className={`detalle__mini${activa === i ? ' is-active' : ''}`}
                    onClick={() => setActiva(i)}
                    aria-label={`Ver imagen ${i + 1} de ${imagenes.length}`}
                    aria-pressed={activa === i}
                  >
                    <img src={src} alt="" loading="lazy" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="detalle__media">
            {imagenes[activa] ? (
              <img src={imagenes[activa]} alt={item.nombre} />
            ) : (
              <div className="detalle__ph" aria-hidden="true" />
            )}
          </div>
        </div>

        <div className="detalle__info">
          <h1 className="k-signal detalle__title">{item.nombre}</h1>

          {/* Notas de cata: lo primero que mira alguien que compra especialidad. */}
          {item.notas.length > 0 && (
            <ul className="detalle__notas">
              {item.notas.map((n) => (
                <li key={n} className="detalle__nota">{n}</li>
              ))}
            </ul>
          )}

          <p className="k-data detalle__precio">
            {precio(variante ? variante.precio : item.precioDesde)}
          </p>

          {item.descripcion && <p className="detalle__desc">{item.descripcion}</p>}

          {fichaFilas.length > 0 && (
            <dl className="detalle__ficha">
              {fichaFilas.map(([k, label]) => (
                <div key={k} className="detalle__ficha-fila">
                  <dt>{label}</dt>
                  <dd>{item.ficha[k]}</dd>
                </div>
              ))}
            </dl>
          )}

          {tieneOpciones && (
            <fieldset className="detalle__campo">
              <legend className="k-label">
                {etiquetaOpcion}
                {variante?.label ? `: ${variante.label}` : ''}
              </legend>
              <div className="detalle__talles">
                {item.variantes.map((v) => (
                  <button
                    key={v.label}
                    type="button"
                    className={`detalle__talle${variante?.label === v.label ? ' is-active' : ''}`}
                    onClick={() => setVariante(v)}
                    aria-pressed={variante?.label === v.label}
                    disabled={v.stock === 0}
                    title={v.stock === 0 ? 'Sin stock' : undefined}
                  >
                    {v.label}
                    {item.variosPrecios && (
                      <em className="detalle__talle-precio">{precio(v.precio)}</em>
                    )}
                  </button>
                ))}
              </div>
            </fieldset>
          )}

          {necesitaMolienda && (
            <label className="detalle__campo detalle__molienda">
              <span className="k-label">En grano o molido</span>
              <select value={molienda} onChange={(e) => setMolienda(e.target.value)}>
                <option value="">Elegí una opción</option>
                {item.molienda.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </label>
          )}

          <div className="detalle__compra">
            <div className="detalle__stepper">
              <button type="button" onClick={() => setCantidad((c) => Math.max(1, c - 1))} aria-label="Quitar uno">
                −
              </button>
              <span className="k-data">{cantidad}</span>
              <button
                type="button"
                onClick={() => setCantidad((c) => Math.min(variante?.stock || 99, c + 1))}
                aria-label="Agregar uno"
              >
                +
              </button>
            </div>

            <button
              className="k-btn detalle__add"
              onClick={agregar}
              disabled={sinStock || varianteSinStock}
            >
              {sinStock
                ? 'Sin stock'
                : varianteSinStock
                  ? `Sin stock en ${variante?.label}`
                  : 'Agregar al carrito'}
            </button>
          </div>

          <p className="detalle__envio k-data">
            Retiro sin cargo en Olivos I, Olivos II o Belgrano · Envíos a todo el país
          </p>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="detalle__relacionados">
          <h2 className="k-signal detalle__rel-title">También te puede gustar</h2>

          <div className="detalle__rel-grid">
            {relacionados.map((r) => (
              <Link key={r.id} to={`/merch/${r.id}`} className="detalle__rel-card">
                <div className="detalle__rel-img">
                  {r.imagen && <img src={r.imagen} alt={r.nombre} loading="lazy" />}
                </div>
                {r.perfil && <p className="detalle__rel-perfil">{r.perfil}</p>}
                <h3 className="detalle__rel-nombre">{r.nombre}</h3>
                <p className="k-data detalle__rel-pesos">
                  {r.variantes.map((v) => v.label).filter(Boolean).join(' · ')}
                </p>
                <p className="k-data detalle__rel-precio">
                  {r.variosPrecios && <span>Desde </span>}
                  {precio(r.precioDesde)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default MerchDetail;