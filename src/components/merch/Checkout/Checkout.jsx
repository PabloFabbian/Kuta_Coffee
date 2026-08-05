import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../../context/CartContext';
import { createOrder } from '../../../services/firestore';
import { LOCALES } from '../../../data/locales';
import { SITE, precio, waLink } from '../../../data/site';
import './Checkout.css';

/**
 * Checkout en pasos, al estilo Tiendanube.
 *
 * Carrito → Entrega → Pago. El primer paso ya viene resuelto (se llega desde
 * el carrito), así que arranca en Entrega y se muestra tildado.
 *
 * El orden importa: el mail se pide primero y se guarda antes de pedir la
 * dirección. Si alguien abandona en el paso de pago, queda el contacto para
 * recuperar la venta; con un checkout de una sola pantalla, no queda nada.
 *
 * Al confirmar se graba la orden en Firestore como `pendiente` y se pide el
 * link de pago a /api/create-preference. Si esa función no está desplegada,
 * la orden igual queda guardada y se ofrece cerrarla por WhatsApp: preferimos
 * una venta manual a una venta perdida.
 */

const PASOS = [
  { id: 'carrito', label: 'Carrito' },
  { id: 'entrega', label: 'Entrega' },
  { id: 'pago', label: 'Pago' },
];

const VACIO = {
  email: '',
  nombre: '',
  telefono: '',
  entrega: 'retiro',
  local: LOCALES[0].id,
  direccion: '',
  localidad: '',
  cp: '',
};

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const [paso, setPaso] = useState('entrega');
  const [f, setF] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [ordenId, setOrdenId] = useState(null);

  const set = (campo) => (e) => setF((prev) => ({ ...prev, [campo]: e.target.value }));

  const validarEntrega = () => {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Revisá el mail: falta el @ o el dominio.';
    if (f.nombre.trim().length < 3) e.nombre = 'Escribí tu nombre y apellido.';
    if (f.telefono.replace(/\D/g, '').length < 8) e.telefono = 'Necesitamos un teléfono de contacto.';
    if (f.entrega === 'envio') {
      if (!f.direccion.trim()) e.direccion = 'Falta la dirección de entrega.';
      if (!f.localidad.trim()) e.localidad = 'Falta la localidad.';
      if (!/^\d{4}$/.test(f.cp.trim())) e.cp = 'El código postal tiene 4 dígitos.';
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const continuar = () => {
    if (!validarEntrega()) {
      toast.error('Revisá los campos marcados.');
      return;
    }
    setPaso('pago');
    window.scrollTo(0, 0);
  };

  const mensajeWhatsApp = (id) =>
    `Hola Kuta, hice el pedido ${id}:\n` +
    cart.map((l) => `• ${l.cantidad}x ${l.nombre}${l.talle ? ` (${l.talle})` : ''}`).join('\n') +
    `\nTotal: ${precio(total)}`;

  const pagar = async () => {
    setEnviando(true);
    try {
      const entrega =
        f.entrega === 'retiro'
          ? { tipo: 'retiro', local: f.local }
          : { tipo: 'envio', direccion: f.direccion, localidad: f.localidad, cp: f.cp };

      const id = await createOrder({
        comprador: { nombre: f.nombre, email: f.email, telefono: f.telefono },
        items: cart.map(({ key, ...resto }) => resto),
        total,
        entrega,
      });

      setOrdenId(id);

      const res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ordenId: id, items: cart, comprador: { email: f.email } }),
      });

      if (!res.ok) throw new Error('preference');

      const { init_point: link } = await res.json();
      if (!link) throw new Error('preference');

      clearCart();
      window.location.href = link;
    } catch {
      // La orden ya está guardada; sólo falló el link de pago.
      toast.info('Guardamos tu pedido. Te lo cerramos por WhatsApp.');
    } finally {
      setEnviando(false);
    }
  };

  /* --- Estados terminales ------------------------------------------------ */

  if (cart.length === 0 && !ordenId) {
    return (
      <main className="checkout k-shell">
        <h1 className="k-signal checkout__title">Checkout</h1>
        <p style={{ color: 'var(--texto-suave)', margin: '1rem 0 2rem' }}>
          No hay nada en el carrito.
        </p>
        <Link to="/merch" className="k-btn">
          Ver la tienda
        </Link>
      </main>
    );
  }

  if (ordenId && cart.length > 0) {
    return (
      <main className="checkout k-shell">
        <p className="k-label">Pedido {ordenId.slice(0, 8).toUpperCase()}</p>
        <h1 className="k-signal checkout__title">Pedido registrado</h1>
        <p className="checkout__nota">
          No pudimos abrir el pago online. Escribinos y lo cerramos a mano: el pedido ya
          está guardado con tus datos.
        </p>
        <div className="checkout__acciones">
          <a className="k-btn" href={waLink(mensajeWhatsApp(ordenId))} target="_blank" rel="noreferrer">
            Cerrar por WhatsApp
          </a>
          <a className="k-btn k-btn--ghost" href={`mailto:${SITE.email}`}>
            Escribir por mail
          </a>
        </div>
      </main>
    );
  }

  const indiceActual = PASOS.findIndex((p) => p.id === paso);

  return (
    <main className="checkout k-shell">
      {/* --- Barra de pasos --- */}
      <ol className="pasos" aria-label="Progreso de la compra">
        {PASOS.map((p, i) => {
          const estado = i < indiceActual ? 'hecho' : i === indiceActual ? 'activo' : 'pendiente';
          return (
            <li key={p.id} className={`pasos__item is-${estado}`}>
              <span className="pasos__marca" aria-hidden="true">
                {estado === 'hecho' ? '✓' : i + 1}
              </span>
              <span className="pasos__label">{p.label}</span>
            </li>
          );
        })}
      </ol>

      <div className="checkout__grid">
        <div className="checkout__form">
          {paso === 'entrega' && (
            <>
              <section className="checkout__bloque">
                <h2 className="k-label">Datos de contacto</h2>

                <label className="campo">
                  <span>E-mail</span>
                  <input type="email" value={f.email} onChange={set('email')} autoComplete="email" />
                  {errores.email && <em className="campo__error">{errores.email}</em>}
                </label>

                <label className="campo">
                  <span>Nombre y apellido</span>
                  <input value={f.nombre} onChange={set('nombre')} autoComplete="name" />
                  {errores.nombre && <em className="campo__error">{errores.nombre}</em>}
                </label>

                <label className="campo">
                  <span>Teléfono</span>
                  <input type="tel" value={f.telefono} onChange={set('telefono')} autoComplete="tel" />
                  {errores.telefono && <em className="campo__error">{errores.telefono}</em>}
                </label>
              </section>

              <section className="checkout__bloque">
                <h2 className="k-label">Entrega</h2>

                <div className="checkout__opciones">
                  <button
                    type="button"
                    className={`checkout__opcion${f.entrega === 'retiro' ? ' is-active' : ''}`}
                    onClick={() => setF((p) => ({ ...p, entrega: 'retiro' }))}
                  >
                    <strong>Retiro en local</strong>
                    <span>Sin cargo</span>
                  </button>
                  <button
                    type="button"
                    className={`checkout__opcion${f.entrega === 'envio' ? ' is-active' : ''}`}
                    onClick={() => setF((p) => ({ ...p, entrega: 'envio' }))}
                  >
                    <strong>Envío a domicilio</strong>
                    <span>Se cotiza al confirmar</span>
                  </button>
                </div>

                {f.entrega === 'retiro' ? (
                  <label className="campo">
                    <span>¿En qué local lo retirás?</span>
                    <select value={f.local} onChange={set('local')}>
                      {LOCALES.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.nombre} — {l.calle}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <>
                    <label className="campo">
                      <span>Dirección</span>
                      <input value={f.direccion} onChange={set('direccion')} autoComplete="street-address" />
                      {errores.direccion && <em className="campo__error">{errores.direccion}</em>}
                    </label>
                    <div className="checkout__par">
                      <label className="campo">
                        <span>Localidad</span>
                        <input value={f.localidad} onChange={set('localidad')} />
                        {errores.localidad && <em className="campo__error">{errores.localidad}</em>}
                      </label>
                      <label className="campo">
                        <span>Código postal</span>
                        <input value={f.cp} onChange={set('cp')} inputMode="numeric" maxLength={4} />
                        {errores.cp && <em className="campo__error">{errores.cp}</em>}
                      </label>
                    </div>
                  </>
                )}

                <button className="k-btn checkout__continuar" onClick={continuar}>
                  Continuar
                </button>
              </section>
            </>
          )}

          {paso === 'pago' && (
            <section className="checkout__bloque">
              <h2 className="k-label">Revisá y pagá</h2>

              <dl className="checkout__revision">
                <div>
                  <dt>Contacto</dt>
                  <dd>
                    {f.nombre}
                    <br />
                    {f.email}
                    <br />
                    {f.telefono}
                  </dd>
                </div>
                <div>
                  <dt>Entrega</dt>
                  <dd>
                    {f.entrega === 'retiro'
                      ? `Retiro en ${LOCALES.find((l) => l.id === f.local)?.nombre}`
                      : `${f.direccion}, ${f.localidad} (CP ${f.cp})`}
                  </dd>
                </div>
              </dl>

              <button className="checkout__volver" onClick={() => setPaso('entrega')}>
                ← Corregir estos datos
              </button>

              <button className="k-btn checkout__continuar" onClick={pagar} disabled={enviando}>
                {enviando ? 'Procesando…' : 'Ir a pagar'}
              </button>

              <p className="checkout__legal k-data">
                Pagás con Mercado Pago. No guardamos datos de tarjeta.
              </p>
            </section>
          )}
        </div>

        {/* --- Resumen, siempre visible --- */}
        <aside className="checkout__resumen">
          <h2 className="k-label">Tu pedido</h2>
          <ul className="checkout__items">
            {cart.map((l) => (
              <li key={l.key}>
                {l.imagen && <img src={l.imagen} alt="" aria-hidden="true" />}
                <span className="checkout__item-nombre">
                  {l.nombre}
                  {l.talle && ` (${l.talle})`} × {l.cantidad}
                </span>
                <span className="k-data">{precio(l.precio * l.cantidad)}</span>
              </li>
            ))}
          </ul>

          <div className="checkout__linea-total">
            <span>Subtotal</span>
            <span className="k-data">{precio(total)}</span>
          </div>

          <div className="checkout__total">
            <span>Total</span>
            <span className="k-data">{precio(total)}</span>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Checkout;
