import LeadForm from '../../components/common/LeadForm/LeadForm';
import './Eventos.css';

const CAMPOS = [
  {
    name: 'tipoEvento',
    label: '¿Qué tipo de evento es?',
    tipo: 'select',
    ancho: 'medio',
    requerido: true,
    opciones: [
      { value: 'corporativo', label: 'Evento corporativo' },
      { value: 'oficina', label: 'Servicio para oficina' },
      { value: 'lanzamiento', label: 'Lanzamiento o activación' },
      { value: 'casamiento', label: 'Casamiento o social' },
      { value: 'otro', label: 'Otro' },
    ],
  },
  {
    name: 'personas',
    label: '¿Cuántas personas?',
    tipo: 'number',
    ancho: 'medio',
    requerido: true,
    placeholder: 'Ej: 80',
  },
  { name: 'fecha', label: 'Fecha estimada', tipo: 'date', ancho: 'medio', requerido: true },
  {
    name: 'lugar',
    label: '¿Dónde sería?',
    tipo: 'text',
    ancho: 'medio',
    requerido: true,
    placeholder: 'Barrio o dirección',
  },
  { name: 'empresa', label: 'Empresa u organización', tipo: 'text', ancho: 'medio', requerido: true },
  { name: 'nombre', label: 'Tu nombre y apellido', tipo: 'text', ancho: 'medio', requerido: true, autoComplete: 'name' },
  { name: 'email', label: 'E-mail', tipo: 'email', ancho: 'medio', requerido: true, autoComplete: 'email' },
  { name: 'telefono', label: 'Teléfono', tipo: 'tel', ancho: 'medio', requerido: true, autoComplete: 'tel' },
  {
    name: 'mensaje',
    label: 'Contanos un poco más',
    tipo: 'textarea',
    requerido: false,
    placeholder: '¿Buscás barra de café, coffee break, algo a medida?',
  },
];

const INCLUYE = [
  {
    titulo: 'Barra de café',
    texto: 'Montamos la barra con máquina, barista y todo el servicio durante el evento.',
  },
  {
    titulo: 'Servicio para oficinas',
    texto: 'Café de especialidad de forma periódica, con la logística resuelta.',
  },
  {
    titulo: 'A medida',
    texto: 'Lanzamientos, activaciones de marca y encuentros con formato propio.',
  },
];

const Eventos = () => (
  <main className="eventos">
    <header className="eventos__head k-shell">
      <p className="k-label">Eventos y empresas</p>

      <div className="eventos__titular">
        <h1 className="k-signal eventos__title">
          Café de especialidad
          <br />
          para tu evento
        </h1>

        {/* El cartel de la puerta, usado en su otro sentido: Kuta está
            abierta a tomar el evento. Es decorativo, no refleja horario. */}

        <img className="eventos__yendo" src="/marca/yendo.png" alt="" aria-hidden="true" />
      </div>

      <p className="eventos__lead">
        Llevamos la barra de Kuta a oficinas, lanzamientos y encuentros. Contanos qué
        necesitás y te armamos una propuesta.
      </p>
    </header>

    <section className="eventos__incluye k-shell">
      {INCLUYE.map((b) => (
        <article key={b.titulo} className="eventos__bloque">
          <h2 className="eventos__bloque-title">{b.titulo}</h2>
          <p className="eventos__bloque-text">{b.texto}</p>
        </article>
      ))}
    </section>

    <section className="eventos__form k-shell" id="cotizar">
      <div className="eventos__form-head">
        <div>
          <h2 className="k-signal eventos__form-title">Pedí una propuesta</h2>
          <p className="eventos__form-nota">
            Con estos datos podemos cotizarte sin un ida y vuelta previo.
          </p>
        </div>
      </div>

      <LeadForm
        tipo="eventos"
        campos={CAMPOS}
        textoBoton="Pedir propuesta"
        mensajeExito="Te mandamos una propuesta con precios y opciones dentro de las próximas 48 horas hábiles."
      />
    </section>
  </main>
);

export default Eventos;