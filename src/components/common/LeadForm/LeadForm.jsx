import { useState } from 'react';
import { toast } from 'react-toastify';
import { SITE, waLink } from '../../../data/site';
import './LeadForm.css';

/**
 * Formulario de captación, configurable por `campos`.
 *
 * Eventos y Mayorista son el mismo mecanismo — capturar un lead calificado y
 * que le llegue a alguien — con distintas preguntas. Un solo componente evita
 * mantener dos formularios que divergen con el tiempo.
 *
 * Cada campo: { name, label, tipo, requerido, opciones, placeholder, ancho }
 *   tipo: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea'
 *   ancho: 'medio' para que entren dos por fila en desktop
 */
const LeadForm = ({ tipo, campos, textoBoton = 'Enviar consulta', mensajeExito }) => {
  const inicial = Object.fromEntries(
    campos.map((c) => [c.name, c.tipo === 'select' ? c.opciones[0].value : ''])
  );

  const [f, setF] = useState(inicial);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const set = (name) => (e) => setF((prev) => ({ ...prev, [name]: e.target.value }));

  const validar = () => {
    const e = {};
    for (const c of campos) {
      const v = String(f[c.name] ?? '').trim();
      if (c.requerido && !v) {
        e[c.name] = 'Este dato nos hace falta.';
        continue;
      }
      if (!v) continue;
      if (c.tipo === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        e[c.name] = 'Revisá el mail: falta el @ o el dominio.';
      }
      if (c.tipo === 'tel' && v.replace(/\D/g, '').length < 8) {
        e[c.name] = 'El teléfono parece incompleto.';
      }
      if (c.tipo === 'number' && (Number.isNaN(Number(v)) || Number(v) <= 0)) {
        e[c.name] = 'Poné un número.';
      }
    }
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
      // El guardado y el aviso por mail pasan por el servidor: la clave de
      // Resend es secreta y así Firestore puede prohibir del todo que el
      // navegador escriba en `leads`.
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, datos: f }),
      });
      if (!res.ok) throw new Error('lead');
      setEnviado(true);
    } catch {
      toast.error('No pudimos enviar el formulario. Escribinos por WhatsApp y lo resolvemos.');
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div className="lead__exito">
        <h2 className="k-signal lead__exito-title">Recibido</h2>
        <p className="lead__exito-texto">
          {mensajeExito ?? 'Te escribimos dentro de las próximas 48 horas hábiles.'}
        </p>
        <a
          className="k-btn k-btn--ghost"
          href={waLink(`Hola Kuta, mandé el formulario de ${tipo}.`)}
          target="_blank"
          rel="noreferrer"
        >
          Escribirnos por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form className="lead" onSubmit={enviar} noValidate>
      <div className="lead__grid">
        {campos.map((c) => (
          <label
            key={c.name}
            className={`lead__campo${c.ancho === 'medio' ? ' lead__campo--medio' : ''}`}
          >
            <span className="lead__label">
              {c.label}
              {!c.requerido && <em className="lead__opcional"> (opcional)</em>}
            </span>

            {c.tipo === 'select' ? (
              /* El envoltorio existe para colgarle la flecha: los <select> no
                 admiten ::after de forma confiable. */
              <span className="lead__select">
                <select value={f[c.name]} onChange={set(c.name)}>
                  {c.opciones.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </span>
            ) : c.tipo === 'textarea' ? (
              <textarea value={f[c.name]} onChange={set(c.name)} placeholder={c.placeholder} />
            ) : (
              <input
                type={c.tipo === 'number' ? 'text' : c.tipo}
                inputMode={c.tipo === 'number' ? 'numeric' : undefined}
                value={f[c.name]}
                onChange={set(c.name)}
                placeholder={c.placeholder}
                autoComplete={c.autoComplete}
              />
            )}

            {errores[c.name] && <em className="lead__error">{errores[c.name]}</em>}
          </label>
        ))}
      </div>

      <button className="k-btn lead__submit" type="submit" disabled={enviando}>
        {enviando ? 'Enviando…' : textoBoton}
      </button>

      <p className="lead__pie">
        ¿Preferís escribir directo? <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
      </p>
    </form>
  );
};

export default LeadForm;