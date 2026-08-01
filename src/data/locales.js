/**
 * Los tres locales. Van hardcodeados a propósito: cambian una vez por año,
 * no justifican una colección en Firestore ni una lectura por visita.
 * Para agregar un local nuevo, sumá un objeto acá y listo.
 */
export const LOCALES = [
  {
    id: 'olivos-estrada',
    nombre: 'Olivos I',
    foto: '/locales/olivos1.jpg',
    calle: 'José Manuel Estrada 2591',
    barrio: 'Olivos, Vicente López',
    apertura: 2021,
    horarios: [
      { dias: 'Lun a Vie', horas: '08:30 – 19:00' },
      { dias: 'Sábados', horas: '09:00 – 14:00' },
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
    apertura: 2023,
    horarios: [
      { dias: 'Lun a Vie', horas: '08:00 – 20:00' },
      { dias: 'Sáb y Dom', horas: '09:00 – 20:00' },
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
    apertura: 2025,
    horarios: [{ dias: 'Lun a Sáb', horas: '08:00 – 20:00' }],
    maps: 'https://www.google.com/maps/search/?api=1&query=Kuta+Cafe+Belgrano',
    nota: 'El más nuevo, primer local en Capital.',
  },
];