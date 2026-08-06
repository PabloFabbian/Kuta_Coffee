/**
 * Firebase Admin, compartido por las funciones de /api.
 *
 * Admin ignora las reglas de Firestore: por eso puede escribir en colecciones
 * que el navegador tiene prohibidas. Es justamente lo que queremos — que
 * escribir órdenes y leads sea potestad del servidor y no del cliente.
 *
 * La credencial viaja en una sola variable de entorno, FIREBASE_SERVICE_ACCOUNT,
 * con el JSON de la service account en base64. En base64 porque el JSON tiene
 * saltos de línea dentro de la private_key y los paneles de variables de
 * entorno los suelen romper.
 */
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let db;

export const getDb = () => {
  if (db) return db;

  const crudo = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!crudo) throw new Error('Falta FIREBASE_SERVICE_ACCOUNT');

  // Aceptamos el JSON pelado o en base64, para no depender de cómo lo pegue
  // quien configure el proyecto.
  const json = crudo.trim().startsWith('{')
    ? crudo
    : Buffer.from(crudo, 'base64').toString('utf8');

  const credenciales = JSON.parse(json);

  const app = getApps().length
    ? getApps()[0]
    : initializeApp({ credential: cert(credenciales) });

  db = getFirestore(app);
  return db;
};

/** Respuesta JSON corta, para no repetir headers en cada función. */
export const json = (res, status, cuerpo) =>
  res.status(status).json(cuerpo);
