import './Campo.css';

/**
 * Campo de formulario. Los estilos estaban duplicados entre Checkout y
 * LeadForm, así que la flecha propia del select sólo existía en uno de los dos.
 *
 * `tipo` acepta lo mismo que un input nativo más 'select' y 'textarea'.
 */
const Campo = ({
  label,
  tipo = 'text',
  value,
  onChange,
  error,
  requerido = true,
  opciones = [],
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  ancho,
  id,
}) => {
  const control =
    tipo === 'select' ? (
      // El envoltorio existe para colgarle la flecha: los <select> no admiten
      // ::after de forma confiable.
      <span className="campo__select">
        <select value={value} onChange={onChange} aria-invalid={Boolean(error)}>
          {opciones.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </span>
    ) : tipo === 'textarea' ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
      />
    ) : (
      <input
        type={tipo === 'number' ? 'text' : tipo}
        inputMode={inputMode ?? (tipo === 'number' ? 'numeric' : undefined)}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
      />
    );

  return (
    <label className={`campo${ancho === 'medio' ? ' campo--medio' : ''}`} htmlFor={id}>
      <span className="campo__label">
        {label}
        {!requerido && <em className="campo__opcional"> (opcional)</em>}
      </span>

      {control}

      {error && <em className="campo__error">{error}</em>}
    </label>
  );
};

export default Campo;
