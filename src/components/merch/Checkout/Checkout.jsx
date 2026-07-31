import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../../../context/CartContext';
import { createOrder } from '../../../services/firestore';
import { LOCALES } from '../../../data/locales';
import { SITE, precio, waLink } from '../../../data/site';
import './Checkout.css';

/**
 * Checkout de merch.
 *
 * Flujo: se graba la orden en Firestore como `pendiente` y se pide una
 * preferencia de Mercado Pago a la funciÃ³n serverless
 * (api/create-preference.js), que devuelve el link de pago.
 *
 * Si esa funciÃ³n todavÃ­a no estÃ¡ desplegada o falla, el pedido igual queda
 * guardado y se ofrece cerrarlo por WhatsApp. Preferimos una venta manual a
 * una venta perdida.
 */

const VACIO = {
  nombre: '',
  email: '',
  emailRepetido: '',
  telefono: '',
  entrega: 'retiro',
  local: LOCALES[0].id,
  direccion: '',
  localidad: '',
  cp: '',
};

const Checkout = () => {
  const { cart, total, clearCart } = useCart();
  const [f, setF] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [ordenId, setOrdenId] = useState(null);

  const set = (campo) => (e) => setF((prev) => ({ ...prev, [campo]: e.target.value }));

  const validar = () => {
    const e = {};
    if (f.nombre.trim().length < 3) e.nombre = 'EscribÃ­ tu nombre y apellido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'RevisÃ¡ el mail: falta el @ o el dominio.';
    if (f.email !== f.emailRepetido) e.emailRepetido = 'Los dos mails tienen que coincidir.';
    if (f.telefono.replace(/\D/g, '').length < 8) e.telefono = 'Necesitamos un telÃ©fono de contacto.';
    if (f.entrega === 'envio') {
      if (!f.direccion.trim()) e.direccion = 'Falta la direcciÃ³n de entrega.';
      if (!f.localidad.trim()) e.localidad = 'Falta la localidad.';
      if (!/^\d{4}$/.test(f.cp.trim())) e.cp = 'El cÃ³digo postal tiene 4 dÃ­gitos.';
    }
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const mensajeWhatsApp = (id) =>
    `Hola Kuta, hice el pedido ${id}:\n` +
    cart.map((l) => `â€¢ ${l.cantidad}x ${l.nombre}${l.talle ? ` (${l.talle})` : ''}`).join('\n') +
    `\nTotal: ${precio(total)}`;

  const confirmar = async () => {
    if (!validar()) {
      toast.error('RevisÃ¡ los campos marcados.');
      return;
    }

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

      // Handoff a Mercado Pago.
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
      // La orden ya estÃ¡ guardada; sÃ³lo fallÃ³ el link de pago.
      toast.info('Guardamos tu pedido. Te lo cerramos por WhatsApp.');
    } finally {
      setEnviando(false);
    }
  };

  if (cart.length === 0 && !ordenId) {
    return (
      <main className="checkout k-shell">
        <h1 className="k-signal checkout__title">Checkout</h1>
        <p style={{ color: 'var(--humo)', margin: '1rem 0 2rem' }}>
          No hay nada en el carrito.
        </p>
        <Link to="/merch" className="k-btn">
          Ver la tienda
        </Link>
      </main>
    );
  }

  // Se guardÃ³ la orden pero no hubo link de pago: cierre manual.
  if (ordenId && cart.length > 0) {
    return (
      <main className="checkout k-shell">
        <p className="k-label">Pedido {ordenId.slice(0, 8).toUpperCase()}</p>
        <h1 className="k-signal checkout__title">Pedido registrado</h1>
        <p className="checkout__nota">
          No pudimos abrir el pago online. Escribinos y lo cerramos a mano, el pedido ya
          estÃ¡ guardado con tus datos.
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

  return (
    <main className="checkout k-shell">
      <h1 className="k-signal checkout__title">Checkout</h1>

      <div className="checkout__grid">
        <div className="checkout__form">
          <section className="checkout__bloque">
            <h2 className="k-label">Tus datos</h2>

            <label className="campo">
              <span>Nombre y apellido</span>
              <input value={f.nombre} onChange={set('nombre')} autoComplete="name" />
              {errores.nombre && <em className="campo__error">{errores.nombre}</em>}
            </label>

            <label className="campo">
              <span>Email</span>
              <input type="email" value={f.email} onChange={set('email')} autoComplete="email" />
              {errores.email && <em className="campo__error">{errores.email}</em>}
            </label>

            <label className="campo">
              <span>RepetÃ­ el email</span>
              <input type="email" value={f.emailRepetido} onChange={set('emailRepetido')} />
              {errores.emailRepetido && <em className="campo__error">{errores.emailRepetido}</em>}
            </label>

            <label className="campo">
              <span>TelÃ©fono</span>
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
                <strong>EnvÃ­o a domicilio</strong>
                <span>Se cotiza al confirmar</span>
              </button>
            </div>

            {f.entrega === 'retiro' ? (
              <label className="campo">
                <span>Â¿En quÃ© local lo retirÃ¡s?</span>
                <select value={f.local} onChange={set('local')}>
                  {LOCALES.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.nombre} â€” {l.calle}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <>
                <label className="campo">
                  <span>DirecciÃ³n</span>
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
                    <span>CÃ³digo postal</span>
                    <input value={f.cp} onChange={set('cp')} inputMode="numeric" maxLength={4} />
                    {errores.cp && <em className="campo__error">{errores.cp}</em>}
                  </label>
                </div>
              </>
            )}
          </section>
        </div>

        <aside className="checkout__resumen">
          <h2 className="k-label">Tu pedido</h2>
          <ul className="checkout__items">
            {cart.map((l) => (
              <li key={l.key}>
                <span>
                  {l.cantidad}Ã— {l.nombre}
                  {l.talle && ` Â· ${l.talle}`}
                </span>
                <span className="k-data">{precio(l.precio * l.cantidad)}</span>
              </li>
            ))}
          </ul>

          <div className="checkout__total">
            <span>Total</span>
            <span className="k-data">{precio(total)}</span>
          </div>

          <button className="k-btn checkout__pagar" onClick={confirmar} disabled={enviando}>
            {enviando ? 'Procesandoâ€¦' : 'Ir a pagar'}
          </button>

          <p className="checkout__legal k-data">
            PagÃ¡s con Mercado Pago. No guardamos datos de tarjeta.
          </p>
        </aside>
      </div>
    </main>
  );
};

export default Checkout;
