/**
 * Constantes del sitio. Todo lo que un no-programador podría querer cambiar
 * sin tocar componentes vive acá.
 */
export const SITE = {
  nombre: 'Kuta',
  bajada: 'Café de especialidad',
  claim: 'Café que va con vos, a donde sea que vayas',
  email: 'kuta.cafeteria@gmail.com',
  // Formato internacional sin + ni espacios (lo pide la API de wa.me).
  whatsapp: '5491100000000', // TODO: número real de Kuta
  instagram: 'https://www.instagram.com/kuta_cafe/',
  // Categorías del menú. El id tiene que coincidir con el campo `category`
  // de cada documento en Firestore.
  categoriasMenu: [
    { id: 'cafeteria', label: 'Cafetería' },
    { id: 'licuados', label: 'Licuados' },
    { id: 'jugos', label: 'Jugos' },
    { id: 'delicias', label: 'Delicias' },
  ],
};

/** Arma un link de WhatsApp con mensaje prellenado. */
export const waLink = (mensaje) =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(mensaje)}`;

/** Precio en pesos, sin decimales, con separador de miles argentino. */
export const precio = (valor) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(Number(valor) || 0);
