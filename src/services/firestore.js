import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { db } from './firebase/firebaseConfig';

/**
 * Toda lectura/escritura de Firestore pasa por acá. Los componentes no
 * importan `db` nunca: si mañana cambia el backend, se cambia este archivo.
 *
 * Colecciones:
 *   products  â†’ ítems del menú (ya existente, no requiere migración)
 *   merch     â†’ productos de merchandising (nueva, sí se vende online)
 *   orders    â†’ pedidos de merch
 *   mayorista â†’ leads de venta mayorista
 */

/** Normaliza un doc del menú. Tolera nombres de campo viejos y nuevos. */
const adaptMenuItem = (docSnap) => {
  const d = docSnap.data();
  return {
    id: docSnap.id,
    nombre: d.name ?? d.nombre ?? '',
    descripcion: d.description ?? d.descripcion ?? '',
    precio: Number(d.price ?? d.precio ?? 0),
    imagen: d.img ?? d.imagen ?? '',
    categoria: d.category ?? d.categoria ?? 'cafeteria',
    // Sin el campo, se asume disponible: el menú no puede quedar vacío
    // porque alguien se olvidó de setear un booleano.
    disponible: d.disponible !== false,
    destacado: Boolean(d.destacado),
  };
};

const adaptMerchItem = (docSnap) => {
  const d = docSnap.data();
  const precioBase = Number(d.price ?? d.precio ?? 0);

  /**
   * `variantes` es la fuente única de precio y stock.
   *
   * El café se vende por peso y cada peso vale distinto: 250 g y 1 kg no
   * cuestan lo mismo, así que el precio no puede vivir en el producto. De ahí
   * sale el "Desde $X" de la grilla.
   *
   * Los documentos viejos que traen `talles` + un `precio` suelto se
   * normalizan acá, así no hay que migrar nada en Firestore.
   *
   * De paso arregla el stock: antes era global por producto, o sea que se
   * podía vender un talle L teniendo stock solo de S.
   */
  const variantes =
    Array.isArray(d.variantes) && d.variantes.length
      ? d.variantes.map((v) => ({
        label: String(v.label),
        precio: Number(v.precio ?? precioBase),
        stock: Number(v.stock ?? 0),
      }))
      : Array.isArray(d.talles) && d.talles.length
        ? d.talles.map((t) => ({
          label: String(t),
          precio: precioBase,
          stock: Number(d.stock ?? 0),
        }))
        : [{ label: null, precio: precioBase, stock: Number(d.stock ?? 0) }];

  const precios = variantes.map((v) => v.precio);

  return {
    id: docSnap.id,
    nombre: d.name ?? d.nombre ?? '',
    descripcion: d.description ?? d.descripcion ?? '',
    // 'cafe' | 'merch'. Sin el campo se asume merch, que es lo que ya existe.
    categoria: d.categoria === 'cafe' ? 'cafe' : 'merch',
    // Descriptor corto de taza: "Floral y delicado". Solo para café.
    perfil: d.perfil ?? '',
    origen: d.origen ?? '',
    // Notas de cata sueltas: ["Naranja", "Pomelo", "Floral"].
    notas: Array.isArray(d.notas) ? d.notas : [],
    // Ficha del lote. Se renderiza sola: lo que no esté cargado no se muestra,
    // así un café sin datos de finca no deja filas vacías.
    ficha: d.ficha ?? {},
    /**
     * Molienda. No es una variante: no cambia precio ni stock, es una
     * instrucción de preparación. Viaja pegada a la etiqueta de la variante
     * ("250 g · Espresso") para que llegue al pedido y a Mercado Pago sin
     * tener que tocar el carrito.
     */
    molienda: Array.isArray(d.molienda) ? d.molienda : [],
    imagen: d.img ?? d.imagen ?? '',
    imagenes: d.imagenes ?? (d.img ? [d.img] : []),
    variantes,
    precioDesde: Math.min(...precios),
    variosPrecios: Math.min(...precios) !== Math.max(...precios),
    precio: precioBase || Math.min(...precios),
    stock: variantes.reduce((acc, v) => acc + v.stock, 0),
    activo: d.activo !== false,
  };
};

/** Menú completo, ordenado por categoría. Una sola lectura para toda la carta. */
export const getMenu = async () => {
  const snap = await getDocs(collection(db, 'products'));
  return snap.docs.map(adaptMenuItem).filter((i) => i.disponible);
};

/** Menú de una categoría puntual. */
export const getMenuByCategory = async (categoria) => {
  const snap = await getDocs(
    query(collection(db, 'products'), where('category', '==', categoria))
  );
  return snap.docs.map(adaptMenuItem).filter((i) => i.disponible);
};

/** Merch activo. */
export const getMerch = async () => {
  const snap = await getDocs(collection(db, 'merch'));
  return snap.docs.map(adaptMerchItem).filter((i) => i.activo);
};

/** Un producto de merch por id. Devuelve null si no existe. */
export const getMerchItem = async (id) => {
  const snap = await getDoc(doc(db, 'merch', id));
  return snap.exists() ? adaptMerchItem(snap) : null;
};

/*
 * createOrder y createLead se fueron del cliente.
 *
 * Las órdenes las crea /api/create-preference —que además valida los precios
 * contra esta misma base— y los leads los recibe /api/lead. El navegador ya no
 * escribe nada en Firestore, así que las reglas cierran ambas colecciones.
 */


/** Imágenes del carrusel de Nosotros (documento único en `about/gallery`). */
export const getAboutImages = async () => {
  try {
    const snap = await getDoc(doc(db, 'about', 'gallery'));
    return snap.exists() ? snap.data().images ?? [] : [];
  } catch {
    return [];
  }
};