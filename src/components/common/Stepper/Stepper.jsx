import './Stepper.css';

/**
 * Selector de cantidad. Estaba escrito tres veces —detalle de producto,
 * carrito y drawer— con la misma lógica y tres hojas de estilo casi iguales.
 *
 * `min` en 0 permite que restar desde 1 elimine la línea, que es lo que hace
 * el carrito; el detalle usa 1 porque ahí no hay nada que eliminar.
 */
const Stepper = ({
  valor,
  onCambio,
  min = 1,
  max = 99,
  etiqueta = '',
  tamano = 'md',
}) => {
  const sufijo = etiqueta ? ` de ${etiqueta}` : '';

  return (
    <div className={`stepper stepper--${tamano}`}>
      <button
        type="button"
        onClick={() => onCambio(valor - 1)}
        disabled={valor <= min}
        aria-label={`Quitar uno${sufijo}`}
      >
        −
      </button>

      {/* aria-live: quien usa lector de pantalla escucha el número nuevo sin
          tener que volver a recorrer el control. */}
      <span className="k-data stepper__valor" aria-live="polite">
        {valor}
      </span>

      <button
        type="button"
        onClick={() => onCambio(valor + 1)}
        disabled={valor >= max}
        aria-label={`Agregar uno${sufijo}`}
      >
        +
      </button>
    </div>
  );
};

export default Stepper;
