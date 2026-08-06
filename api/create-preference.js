import { getDb, json } from './_firebase.js';

/**
 * Crea la orden y devuelve el link de pago de Mercado Pago.
 *
 * Acá está el cambio importante respecto de la versión anterior: **los precios
 * salen de Firestore, no del navegador**. Antes la función confiaba en lo que
 * le mandaba el cliente, así que alguien con devtools abierto podía postear un
 * buzo a $1 y Mercado Pago le cobraba $1.
 *
 * El cliente ahora manda sólo qué quiere comprar (id, variante, cantidad). El
 * precio, el stock y el nombre los resuelve el servidor.
 *
 * La orden también se crea acá. El navegador ya no escribe en `orders`, así que
 * las reglas de Firestore pueden cerrarse del todo.
 *
 * Variables de entorno:
 *   FIREBASE_SERVICE_ACCOUNT   credencial de admin (base64)
 *   MP_ACCESS_TOKEN            access token de producción de Mercado Pago
 *   SITE_URL                   dominio final, para las URLs de retorno
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Método no permitido' });

  const token = process.env.MP_ACCESS_TOKEN;
  const siteUrl = process.env.SITE_URL || `https://${req.headers.host}`;
  if (!token) return json(res, 503, { error: 'Mercado Pago no está configurado.' });

  try {
    const { items, comprador, entrega } = req.body ?? {};

    if (!Array.isArray(items) || items.length === 0 || items.length > 30) {
      return json(res, 400, { error: 'Pedido inválido.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(comprador?.email ?? '')) {
      return json(res, 400, { error: 'Email inválido.' });
    }

    const db = getDb();

    /* --- Resolver cada línea contra la base ------------------------------ */
    const lineas = [];
    for (const pedido of items) {
      const cantidad = Math.floor(Number(pedido.cantidad));
      if (!pedido.id || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > 20) {
        return json(res, 400, { error: 'Cantidad inválida.' });
      }

      const doc = await db.collection('merch').doc(String(pedido.id)).get();
      if (!doc.exists) return json(res, 400, { error: `Producto no disponible.` });

      const p = doc.data();
      if (p.activo === false) return json(res, 400, { error: `${p.nombre} ya no está disponible.` });

      // La variante elegida decide precio y stock. Sin variantes, se toma el
      // producto entero.
      const variantes = Array.isArray(p.variantes) && p.variantes.length ? p.variantes : null;
      let precio, stock, etiqueta;

      if (variantes) {
        // El cliente puede mandar "250 g · Molido para espresso": la molienda
        // no es una variante, así que comparamos sólo la primera parte.
        const buscada = String(pedido.variante ?? '').split('·')[0].trim();
        const v = variantes.find((x) => String(x.label).trim() === buscada);
        if (!v) return json(res, 400, { error: `Opción inválida en ${p.nombre}.` });
        precio = Number(v.precio);
        stock = Number(v.stock ?? 0);
        etiqueta = String(pedido.variante).slice(0, 60);
      } else {
        precio = Number(p.precio ?? 0);
        stock = Number(p.stock ?? 0);
        etiqueta = null;
      }

      if (!(precio > 0)) return json(res, 400, { error: `Precio no disponible para ${p.nombre}.` });
      if (cantidad > stock) {
        return json(res, 409, { error: `Nos queda${stock === 1 ? '' : 'n'} ${stock} de ${p.nombre}.` });
      }

      lineas.push({ id: doc.id, nombre: p.nombre, etiqueta, precio, cantidad });
    }

    const total = lineas.reduce((a, l) => a + l.precio * l.cantidad, 0);

    /* --- Guardar la orden ------------------------------------------------ */
    const orden = await db.collection('orders').add({
      comprador: {
        nombre: String(comprador.nombre ?? '').slice(0, 120),
        email: comprador.email,
        telefono: String(comprador.telefono ?? '').slice(0, 40),
      },
      items: lineas,
      total,
      entrega: entrega ?? null,
      estado: 'pendiente',
      fecha: new Date(),
    });

    /* --- Pedir el link de pago ------------------------------------------- */
    const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        external_reference: orden.id,
        items: lineas.map((l) => ({
          id: l.id,
          title: l.etiqueta ? `${l.nombre} (${l.etiqueta})` : l.nombre,
          quantity: l.cantidad,
          unit_price: l.precio,
          currency_id: 'ARS',
        })),
        payer: { email: comprador.email },
        back_urls: {
          success: `${siteUrl}/merch?pago=ok`,
          pending: `${siteUrl}/merch?pago=pendiente`,
          failure: `${siteUrl}/carrito?pago=error`,
        },
        auto_return: 'approved',
        // Acá avisa Mercado Pago cuando el pago cambia de estado.
        notification_url: `${siteUrl}/api/mp-webhook`,
        statement_descriptor: 'KUTA CAFE',
      }),
    });

    if (!r.ok) {
      console.error('MP', r.status, await r.text());
      return json(res, 502, { error: 'No se pudo generar el pago.' });
    }

    const data = await r.json();
    return json(res, 200, { init_point: data.init_point, ordenId: orden.id, total });
  } catch (err) {
    console.error(err);
    return json(res, 500, { error: 'Error inesperado.' });
  }
}
