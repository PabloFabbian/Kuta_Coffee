// Crea la preferencia de pago en Mercado Pago.
// Variables de entorno en Vercel -> Settings -> Environment Variables:
//   MP_ACCESS_TOKEN, SITE_URL
//
// TODO antes de cobrar de verdad: validar precios contra Firestore en vez de
// confiar en los que manda el navegador, y sumar el webhook de MP.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo no permitido' });

  const token = process.env.MP_ACCESS_TOKEN;
  const siteUrl = process.env.SITE_URL || `https://${req.headers.host}`;
  if (!token) return res.status(503).json({ error: 'Mercado Pago no esta configurado.' });

  try {
    const { ordenId, items, comprador } = req.body || {};
    if (!ordenId || !Array.isArray(items) || !items.length) {
      return res.status(400).json({ error: 'Pedido invalido.' });
    }

    const r = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        external_reference: ordenId,
        items: items.map((l) => ({
          id: l.id,
          title: l.talle ? `${l.nombre} (${l.talle})` : l.nombre,
          quantity: Number(l.cantidad),
          unit_price: Number(l.precio),
          currency_id: 'ARS',
        })),
        payer: comprador?.email ? { email: comprador.email } : undefined,
        back_urls: {
          success: `${siteUrl}/merch?pago=ok`,
          pending: `${siteUrl}/merch?pago=pendiente`,
          failure: `${siteUrl}/carrito?pago=error`,
        },
        auto_return: 'approved',
        statement_descriptor: 'KUTA CAFE',
      }),
    });

    if (!r.ok) {
      console.error('MP', r.status, await r.text());
      return res.status(502).json({ error: 'No se pudo generar el pago.' });
    }
    const data = await r.json();
    return res.status(200).json({ init_point: data.init_point, id: data.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error inesperado.' });
  }
}