import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase/firebaseConfig';

/**
 * Toda lectura/escritura de Firestore pasa por acÃ¡. Los componentes no
 * importan `db` nunca: si maÃ±ana cambia el backend, se cambia este archivo.
 *
 * Colecciones:
 *   products  â†’ Ã­tems del menÃº (ya existente, no requiere migraciÃ³n)
 *   merch     â†’ productos de merchandising (nueva, sÃ­ se vende online)
 *   orders    â†’ pedidos de merch
 *   mayorista â†’ leads de venta mayorista
 */

/** Normaliza un doc del menÃº. Tolera nombres de campo viejos y nuevos. */
const adaptMenuItem = (docSnap) => {
  const d = docSnap.data();
  return {
    id: docSnap.id,
    nombre: d.name ?? d.nombre ?? '',
    descripcion: d.description ?? d.descripcion ?? '',
    precio: Number(d.price ?? d.precio ?? 0),
    imagen: d.img ?? d.imagen ?? '',
    categoria: d.category ?? d.categoria ?? 'cafeteria',
    // Sin el campo, se asume disponible: el menÃº no puede quedar vacÃ­o
    // porque alguien se olvidÃ³ de setear un booleano.
    disponible: d.disponible !== false,
    destacado: Boolean(d.destacado),
  };
};

const adaptMerchItem = (docSnap) => {
  const d = docSnap.data();
  return {
    id: docSnap.id,
    nombre: d.name ?? d.nombre ?? '',
    descripcion: d.description ?? d.descripcion ?? '',
    precio: Number(d.price ?? d.precio ?? 0),
    imagen: d.img ?? d.imagen ?? '',
    imagenes: d.imagenes ?? (d.img ? [d.img] : []),
    talles: d.talles ?? [],
    stock: Number(d.stock ?? 0),
    activo: d.activo !== false,
  };
};

/** MenÃº completo, ordenado por categorÃ­a. Una sola lectura para toda la carta. */
export const getMenu = async () => {
  const snap = await getDocs(collection(db, 'products'));
  return snap.docs.map(adaptMenuItem).filter((i) => i.disponible);
};

/** MenÃº de una categorÃ­a puntual. */
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

/**
 * Crea la orden y devuelve su id.
 * No descuenta stock acÃ¡: eso corre en la funciÃ³n serverless reciÃ©n cuando
 * Mercado Pago confirma el pago (ver api/). Descontar antes
 * deja stock fantasma cada vez que alguien abandona el checkout.
 */
export const createOrder = async ({ comprador, items, total, entrega }) => {
  const ref = await addDoc(collection(db, 'orders'), {
    comprador,
    items,
    total,
    entrega,
    estado: 'pendiente',
    fecha: Timestamp.fromDate(new Date()),
  });
  return ref.id;
};

/** Guarda un lead mayorista. */
export const createMayoristaLead = async (lead) => {
  const ref = await addDoc(collection(db, 'mayorista'), {
    ...lead,
    estado: 'nuevo',
    fecha: Timestamp.fromDate(new Date()),
  });
  return ref.id;
};

/** ImÃ¡genes del carrusel de Nosotros (documento Ãºnico en `about/gallery`). */
export const getAboutImages = async () => {
  try {
    const snap = await getDoc(doc(db, 'about', 'gallery'));
    return snap.exists() ? snap.data().images ?? [] : [];
  } catch {
    return [];
  }
};
