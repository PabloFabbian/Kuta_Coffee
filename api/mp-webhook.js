import { getDb, json } from './_firebase.js';

/**
 * Webhook de Mercado Pago: confirma el pago y descuenta stock.
 *
 * Por qué existe: el stock no se puede descontar al crear la orden, porque
 * mucha gente abre el checkout y no paga — quedaría stock fantasma. Se
 * descuenta cuando Mercado Pago confirma que el pago se aprobó, y no antes.
 *
 * Dos cuidados:
 *
 * 1. No confiamos en el cuerpo del aviso. Mercado Pago manda un id; nosotros
 *    consultamos el pago con nuestro propio token. Cualquiera puede postear a
 *    esta URL, pero nadie puede inventar un pago aprobado.
 *
 * 2. Es idempotente. Mercado Pago reintenta el aviso si no respondemos rápido,
 *    así que el descuento va en una transacción que primero comprueba si la
 *    orden ya estaba pagada. Sin eso, un reintento descontaría stock dos veces.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Método no permitido' });

  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) return json(res, 503, { error: 'Sin configurar' });

  try {
    const idPago =
      req.body?.data?.id ?? req.query?.['data.id'] ?? req.query?.id ?? null;
    const tipo = req.body?.type ?? req.query?.type;

    // Mercado Pago manda varios tipos de aviso; sólo nos interesan los pagos.
    if (tipo && tipo !== 'payment') return json(res, 200, { ignorado: tipo });
    if (!idPago) return json(res, 200, { ignorado: 'sin id' });

    const r = await fetch(`https://api.mercadopago.com/v1/payments/${idPago}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) {
      console.error('MP payment', r.status);
      // 200 igual: si devolvemos error, MP reintenta en loop.
      return json(res, 200, { error: 'pago no consultable' });
    }

    const pago = await r.json();
    const ordenId = pago.external_reference;
    if (!ordenId) return json(res, 200, { ignorado: 'sin referencia' });

    const db = getDb();
    const refOrden = db.collection('orders').doc(ordenId);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(refOrden);
      if (!snap.exists) return;

      const orden = snap.data();
      // Ya procesada: no volvemos a descontar.
      if (orden.estado === 'pagada') return;

      if (pago.status !== 'approved') {
        tx.update(refOrden, { estado: pago.status, pagoId: String(idPago) });
        return;
      }

      // Leemos todos los productos antes de escribir: Firestore exige que las
      // lecturas de una transacción vayan antes que las escrituras.
      const docs = await Promise.all(
        orden.items.map((l) => tx.get(db.collection('merch').doc(l.id)))
      );

      docs.forEach((docProd, i) => {
        if (!docProd.exists) return;
        const linea = orden.items[i];
        const p = docProd.data();

        if (Array.isArray(p.variantes) && p.variantes.length) {
          const buscada = String(linea.etiqueta ?? '').split('·')[0].trim();
          const variantes = p.variantes.map((v) =>
            String(v.label).trim() === buscada
              ? { ...v, stock: Math.max(0, Number(v.stock) - linea.cantidad) }
              : v
          );
          tx.update(docProd.ref, { variantes });
        } else {
          tx.update(docProd.ref, {
            stock: Math.max(0, Number(p.stock ?? 0) - linea.cantidad),
          });
        }
      });

      tx.update(refOrden, {
        estado: 'pagada',
        pagoId: String(idPago),
        pagadaEl: new Date(),
      });
    });

    return json(res, 200, { ok: true });
  } catch (err) {
    console.error(err);
    // Siempre 200: un 500 hace que Mercado Pago reintente indefinidamente.
    return json(res, 200, { error: 'procesado con error' });
  }
}
