import { useState } from 'react';
import { toast } from 'react-toastify';
import { createMayoristaLead } from '../../../services/firestore';
import { SITE, waLink } from '../../../data/site';
import '../../merch/Checkout/Checkout.css';
import './Mayorista.css';

/**
 * Mayorista es captación, no venta: el precio por kilo se negocia, no se
 * publica. El formulario guarda el lead en Firestore (colección `mayorista`)
 * y no necesita backend ni servicio de mail de terceros.
 *
 * Para que Kuta se entere de un lead nuevo hay dos caminos, según cuánto
 * quieran automatizar: revisar la colección desde la consola de Firebase, o
 * una Cloud Function con trigger onCreate que dispare el aviso. Arrancar
 * revisando a mano está bien mientras el volumen sea bajo.
 */

const VACIO = {
  nombre: '',
  negocio: '',
  email: '',
  telefono: '',
  instagram: '',
  tipo: 'cafeteria',
  consumo: '',
  mensaje: '',
};

const TIPOS = [
  { id: 'cafeteria', label: 'Cafetería o bar' },
  { id: 'restaurante', label: 'Restaurante' },
  { id: 'oficina', label: 'Oficina' },
  { id: 'reventa', label: 'Reventa / almacén' },
  { id: 'otro', label: 'Otro' },
];

const Mayorista = () => {
  const [f, setF] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const set = (campo) => (e) => setF((prev) => ({ ...prev, [campo]: e.target.value }));

  const validar = () => {
    const e = {};
    if (f.nombre.trim().length < 3) e.nombre = 'Escribí tu nombre y apellido.';
    if (!f.negocio.trim()) e.negocio = 'Contanos cómo se llama tu negocio.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Revisá el mail: falta el @ o el dominio.';
    if (f.telefono.replace(/\D/g, '').length < 8) e.telefono = 'Necesitamos un teléfono de contacto.';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const enviar = async (ev) => {
    ev.preventDefault();
    if (!validar()) {
      toast.error('Revisá los campos marcados.');
      return;
    }

    setEnviando(true);
    try {
      await createMayoristaLead(f);
      setEnviado(true);
    } catch {
      toast.error('No pudimos enviar el formulario. Escribinos por WhatsApp y lo resolvemos.');
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <main className="mayorista k-shell">
        <p className="k-label">Mayorista</p>
        <h1 className="k-signal mayorista__title">Recibido</h1>
        <p className="mayorista__lead">
          Te vamos a escribir a {f.email} dentro de las próximas 48 horas hábiles con la
          lista de precios y las condiciones.
        </p>
        <a
          className="k-btn k-btn--ghost"
          href={waLink(`Hola Kuta, mandé el formulario mayorista para ${f.negocio}.`)}
          target="_blank"
          rel="noreferrer"
        >
          Escribirnos por WhatsApp
        </a>
      </main>
    );
  }

  return (
    <main className="mayorista k-shell">
      <header className="mayorista__head">
        <p className="k-label">Mayorista</p>
        <h1 className="k-signal mayorista__title">Serví Kuta en tu local</h1>
        <p className="mayorista__lead">
          Vendemos grano tostado por kilo a cafeterías, restaurantes y oficinas. Contanos
          de tu negocio y te pasamos la lista con condiciones.
        </p>
      </header>

      <div className="mayorista__grid">
        <form className="mayorista__form" onSubmit={enviar} noValidate>
          <label className="campo">
            <span>Nombre y apellido</span>
            <input value={f.nombre} onChange={set('nombre')} autoComplete="name" />
            {errores.nombre && <em className="campo__error">{errores.nombre}</em>}
          </label>

          <label className="campo">
            <span>Nombre del negocio</span>
            <input value={f.negocio} onChange={set('negocio')} autoComplete="organization" />
            {errores.negocio && <em className="campo__error">{errores.negocio}</em>}
          </label>

          <label className="campo">
            <span>Tipo de negocio</span>
            <select value={f.tipo} onChange={set('tipo')}>
              {TIPOS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          <label className="campo">
            <span>Email</span>
            <input type="email" value={f.email} onChange={set('email')} autoComplete="email" />
            {errores.email && <em className="campo__error">{errores.email}</em>}
          </label>

          <label className="campo">
            <span>Teléfono</span>
            <input type="tel" value={f.telefono} onChange={set('telefono')} autoComplete="tel" />
            {errores.telefono && <em className="campo__error">{errores.telefono}</em>}
          </label>

          <label className="campo">
            <span>Instagram del negocio (opcional)</span>
            <input value={f.instagram} onChange={set('instagram')} placeholder="@" />
          </label>

          <label className="campo">
            <span>Consumo estimado por mes (opcional)</span>
            <input
              value={f.consumo}
              onChange={set('consumo')}
              placeholder="Ej: 10 kg"
            />
          </label>

          <label className="campo">
            <span>Algo más que quieras contarnos (opcional)</span>
            <textarea value={f.mensaje} onChange={set('mensaje')} />
          </label>

          <button className="k-btn mayorista__submit" type="submit" disabled={enviando}>
            {enviando ? 'Enviando…' : 'Enviar consulta'}
          </button>
        </form>

        <aside className="mayorista__aside">
          <h2 className="k-label">Cómo sigue</h2>
          <ol className="mayorista__pasos">
            <li>
              <span className="k-data">01</span>
              <p>Mandás el formulario con los datos de tu negocio.</p>
            </li>
            <li>
              <span className="k-data">02</span>
              <p>Te pasamos lista de precios, mínimos y frecuencia de entrega.</p>
            </li>
            <li>
              <span className="k-data">03</span>
              <p>Coordinamos una degustación y armamos el primer pedido.</p>
            </li>
          </ol>

          <p className="mayorista__contacto">
            Si preferís hablar directo:{' '}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          </p>
        </aside>
      </div>
    </main>
  );
};

export default Mayorista;
