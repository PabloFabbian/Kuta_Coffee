/**
 * Los tres locales. Van hardcodeados a propósito: cambian una vez por año,
 * no justifican una colección en Firestore ni una lectura por visita.
 * Para agregar un local nuevo, sumá un objeto acá y listo.
 *
 * `apertura` es opcional: si falta, el componente no muestra el año. Preferimos
 * no mostrar nada antes que mostrar una fecha inventada — es el tipo de dato
 * que el cliente detecta al instante y que hace dudar de todo lo demás.
 */
export const LOCALES = [
  {
    id: 'olivos-estrada',
    nombre: 'Olivos I',
    foto: '/locales/olivos1.jpg',
    calle: 'José Manuel Estrada 2591',
    barrio: 'Olivos, Vicente López',
    // Del posteo de LinkedIn: 'hace 3 años abríamos este primer Kuta'.
    apertura: 2022,
    horarios: [
      { etiqueta: 'Lun a Vie', dias: [1, 2, 3, 4, 5], desde: '08:30', hasta: '19:00' },
      { etiqueta: 'Sábados', dias: [6], desde: '09:00', hasta: '14:00' },
    ],
    maps: 'https://www.google.com/maps/search/?api=1&query=Jose+Manuel+Estrada+2591+Olivos',
    nota: 'El original. Barra corta, salida rápida a la vereda.',
  },
  {
    id: 'olivos-maipu',
    nombre: 'Olivos II',
    foto: '/locales/olivos2.jpg',
    calle: 'Av. Maipú 2482',
    barrio: 'Olivos, Vicente López',
    apertura: null, // TODO: confirmar con Kuta
    horarios: [
      { etiqueta: 'Lun a Vie', dias: [1, 2, 3, 4, 5], desde: '08:00', hasta: '20:00' },
      { etiqueta: 'Sáb y Dom', dias: [0, 6], desde: '09:00', hasta: '20:00' },
    ],
    maps: 'https://www.google.com/maps/search/?api=1&query=Av+Maipu+2482+Olivos',
    nota: 'Sobre Maipú, el de mayor movimiento. Mesas adentro.',
  },
  {
    id: 'belgrano',
    nombre: 'Belgrano',
    foto: '/locales/belgrano.jpg',
    calle: '3 de Febrero 982',
    barrio: 'Belgrano, CABA',
    apertura: null, // TODO: confirmar con Kuta
    horarios: [
      { etiqueta: 'Lun a Sáb', dias: [1, 2, 3, 4, 5, 6], desde: '08:00', hasta: '20:00' },
    ],
    maps: 'https://www.google.com/maps/search/?api=1&query=Kuta+Cafe+Belgrano',
    nota: 'El más nuevo, primer local en Capital.',
  },
];