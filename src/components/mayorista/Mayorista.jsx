import LeadForm from '../../components/common/LeadForm/LeadForm';
import './Mayorista.css';

/**
 * Mayorista es captación, no venta: el precio por kilo se negocia, no se
 * publica. Usa el mismo LeadForm que Eventos, con otras preguntas.
 */

const CAMPOS = [
  { name: 'nombre', label: 'Nombre y apellido', tipo: 'text', ancho: 'medio', requerido: true, autoComplete: 'name' },
  { name: 'negocio', label: 'Nombre del negocio', tipo: 'text', ancho: 'medio', requerido: true, autoComplete: 'organization' },
  {
    name: 'tipo',
    label: 'Tipo de negocio',
    tipo: 'select',
    ancho: 'medio',
    requerido: true,
    opciones: [
      { value: 'cafeteria', label: 'Cafetería o bar' },
      { value: 'restaurante', label: 'Restaurante' },
      { value: 'oficina', label: 'Oficina' },
      { value: 'reventa', label: 'Reventa / almacén' },
      { value: 'otro', label: 'Otro' },
    ],
  },
  { name: 'consumo', label: 'Consumo estimado por mes', tipo: 'text', ancho: 'medio', requerido: false, placeholder: 'Ej: 10 kg' },
  { name: 'email', label: 'E-mail', tipo: 'email', ancho: 'medio', requerido: true, autoComplete: 'email' },
  { name: 'telefono', label: 'Teléfono', tipo: 'tel', ancho: 'medio', requerido: true, autoComplete: 'tel' },
  { name: 'instagram', label: 'Instagram del negocio', tipo: 'text', ancho: 'medio', requerido: false, placeholder: '@' },
  { name: 'mensaje', label: 'Algo más que quieras contarnos', tipo: 'textarea', requerido: false },
];

const PASOS = [
  'Mandás el formulario con los datos de tu negocio.',
  'Te pasamos lista de precios, mínimos y frecuencia de entrega.',
  'Coordinamos una degustación y armamos el primer pedido.',
];

const Mayorista = () => (
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
      <div className="mayorista__form">
        <LeadForm
          tipo="mayorista"
          campos={CAMPOS}
          textoBoton="Enviar consulta"
          mensajeExito="Te vamos a escribir dentro de las próximas 48 horas hábiles con la lista de precios y las condiciones."
        />
      </div>

      <div className="mayorista__columna">
        <aside className="mayorista__aside">
          <h2 className="k-label">Cómo sigue</h2>
          <ol className="mayorista__pasos">
            {PASOS.map((p, i) => (
              <li key={p}>
                <span className="k-data">{String(i + 1).padStart(2, '0')}</span>
                <p>{p}</p>
              </li>
            ))}
          </ol>
        </aside>

        {/* Debajo del bloque verde, ya sobre el fondo claro de la página: por
            eso usa el arte original en tinta oscura y no la versión clara. */}
        <img
          className="mayorista__quecafe"
          src="/marca/que-cafe.png"
          alt=""
          aria-hidden="true"
         width={446} height={158} />
      </div>
    </div>
  </main>
);

export default Mayorista;