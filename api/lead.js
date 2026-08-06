import { Resend } from 'resend';
import { getDb, json } from './_firebase.js';

/**
 * Recibe un lead de Eventos o Mayorista: lo guarda y avisa por mail.
 *
 * Vive en el servidor y no en el navegador por dos razones. La clave de Resend
 * es secreta —desde el cliente cualquiera podría mandar mails con la cuenta de
 * Kuta— y así las reglas de Firestore pueden prohibir del todo escribir en
 * `leads`, en vez de tener que dejar una puerta abierta.
 *
 * Variables de entorno:
 *   FIREBASE_SERVICE_ACCOUNT   credencial de admin (base64)
 *   RESEND_API_KEY             clave de Resend
 *   LEAD_EMAIL_TO              a quién le llegan los leads
 *   LEAD_EMAIL_FROM            remitente verificado en Resend
 */

const TIPOS = ['eventos', 'mayorista'];

const escapar = (v) =>
  String(v ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Método no permitido' });

  try {
    const { tipo, datos } = req.body ?? {};

    /* --- Validación. El cliente ya valida, pero el cliente se puede saltear. */
    if (!TIPOS.includes(tipo)) return json(res, 400, { error: 'Tipo inválido' });
    if (!datos || typeof datos !== 'object') return json(res, 400, { error: 'Faltan los datos' });

    const campos = Object.entries(datos);
    if (campos.length === 0 || campos.length > 25) {
      return json(res, 400, { error: 'Formulario inválido' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email ?? '')) {
      return json(res, 400, { error: 'Email inválido' });
    }
    // Un campo de 5000 caracteres no es una consulta, es un intento de abuso.
    if (campos.some(([, v]) => String(v).length > 2000)) {
      return json(res, 400, { error: 'Campo demasiado largo' });
    }

    /* --- Guardar --- */
    const db = getDb();
    const ref = await db.collection('leads').add({
      tipo,
      datos,
      estado: 'nuevo',
      fecha: new Date(),
      // Sirve para rastrear abuso sin identificar a nadie.
      origen: req.headers['x-forwarded-for']?.split(',')[0] ?? null,
    });

    /* --- Avisar ---
       Si el mail falla, el lead ya está guardado: devolvemos 200 igual. Perder
       la venta porque se cayó el proveedor de mail sería peor que un aviso
       tardío, y el dato queda en Firestore para recuperarlo. */
    if (process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_TO) {
      try {
        const filas = campos
          .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${escapar(k)}</td><td>${escapar(v)}</td></tr>`)
          .join('');

        await new Resend(process.env.RESEND_API_KEY).emails.send({
          from: process.env.LEAD_EMAIL_FROM ?? 'Kuta <onboarding@resend.dev>',
          to: process.env.LEAD_EMAIL_TO,
          replyTo: datos.email,
          subject: `Nueva consulta de ${tipo}: ${datos.negocio ?? datos.empresa ?? datos.nombre ?? ''}`,
          html: `<h2 style="font-family:system-ui">Consulta de ${escapar(tipo)}</h2>
                 <table style="font-family:system-ui;font-size:14px">${filas}</table>
                 <p style="color:#888;font-size:12px">Lead ${ref.id}</p>`,
        });
      } catch (err) {
        console.error('Resend falló, el lead quedó guardado:', err);
      }
    }

    return json(res, 200, { ok: true, id: ref.id });
  } catch (err) {
    console.error(err);
    return json(res, 500, { error: 'No pudimos procesar el formulario.' });
  }
}
