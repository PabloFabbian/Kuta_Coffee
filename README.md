# Kuta — sitio institucional + tienda

Sitio de Kuta Café: menú informativo, tienda de merch con pago online, venta
mayorista y los tres locales.

Stack: React 18 + React Router 6 sobre Create React App, Firestore como base,
Netlify para hosting y funciones serverless.

---

## Arrancar

```bash
npm install
npm start          # http://localhost:3000
npm run build      # genera build/
```

Necesitás un `.env` en la raíz con la config de Firebase:

```
REACT_APP_apiKey=...
REACT_APP_authDomain=...
REACT_APP_projectId=...
REACT_APP_storageBucket=...
REACT_APP_messagingSenderId=...
REACT_APP_appId=...
REACT_APP_measurementId=...
```

En CRA todo lo que empieza con `REACT_APP_` termina dentro del bundle y es
visible para cualquiera. Está bien para las claves de Firebase, que son
públicas por diseño: lo que protege la base son las reglas de Firestore, no la
clave. Nunca pongas ahí el token de Mercado Pago.

---

## Las dos mitades del sitio

Esta es la decisión de arquitectura que ordena todo lo demás:

| | Menú | Merch |
|---|---|---|
| Qué es | La carta de cafetería | Remeras, buzos, tazas |
| Se compra online | No | Sí |
| Usa el carrito | **Nunca** | Sí |
| Colección | `products` | `merch` |

Kuta es mayormente take away: el café se pide en el mostrador, así que la carta
es sólo lectura. El merch sí se vende, y es lo que reemplaza a la tienda de
Tiendanube.

**Regla que mantiene esto sano:** ningún componente dentro de `components/menu/`
puede importar `CartContext`. Si alguna vez hace falta, es señal de que el
alcance cambió y conviene discutirlo antes.

---

## Estructura

```
src/
├── App.jsx                    Rutas
├── index.css                  Design tokens + estilos base
├── data/
│   ├── locales.js             Los 3 locales (hardcodeados)
│   └── site.js                Contacto, redes, categorías, formato de precio
├── services/
│   ├── firebase/firebaseConfig.jsx
│   └── firestore.js           TODAS las queries viven acá
├── context/
│   └── CartContext.jsx        Carrito de merch, persistido en localStorage
└── components/
    ├── layout/    NavBar · Footer
    ├── home/      Hero · Manifiesto
    ├── menu/      MenuPage
    ├── merch/     MerchPage · MerchDetail · Cart · Checkout · CartWidget
    ├── locales/   Locales
    └── mayorista/ Mayorista
```

Los componentes no importan `db` nunca: todo pasa por `services/firestore.js`.
Si mañana Kuta se muda de Firebase, se cambia ese archivo y nada más.

### Rutas

| Ruta | Pantalla |
|---|---|
| `/` | Hero + Manifiesto + los 3 locales en versión corta |
| `/menu` | La carta completa |
| `/menu/:categoriaId` | La carta, scrolleada a una categoría |
| `/merch` | Tienda |
| `/merch/:id` | Detalle de producto |
| `/carrito` | Carrito |
| `/checkout` | Datos, entrega y pago |
| `/locales` | Los 3 locales con horarios |
| `/mayorista` | Formulario de venta mayorista |

---

## Datos

### `products` — la carta *(ya existía, no hubo que migrar nada)*

```js
{
  name: 'Flat White',
  description: 'Doble espresso con leche texturada',
  price: 3200,
  img: '/Flat White.jpeg',
  category: 'cafeteria',      // cafeteria | licuados | jugos | delicias
  disponible: true            // opcional; si falta, se asume true
}
```

El adapter de `firestore.js` acepta tanto los nombres viejos (`name`, `img`,
`price`) como los castellanos (`nombre`, `imagen`, `precio`), así que podés
migrar de a poco o no migrar nunca.

Los campos `stock` que quedaron en los documentos de la carta ya no se usan:
el menú no descuenta nada.

### `merch` — la tienda *(hay que crearla)*

```js
{
  nombre: 'Buzo Kuta',
  descripcion: 'Frisa peinada, unisex, serigrafía en el pecho',
  precio: 45000,
  imagen: 'https://...',
  talles: ['S', 'M', 'L', 'XL'],   // [] si el producto no tiene talles
  stock: 12,
  activo: true
}
```

### `orders` — pedidos de merch *(la crea el sitio solo)*

```js
{
  comprador: { nombre, email, telefono },
  items: [{ id, nombre, precio, imagen, talle, cantidad }],
  total: 90000,
  entrega: { tipo: 'retiro', local: 'olivos-maipu' }
          // o { tipo: 'envio', direccion, localidad, cp }
  estado: 'pendiente',
  fecha: Timestamp
}
```

### `mayorista` — leads *(la crea el sitio solo)*

Nombre, negocio, tipo, email, teléfono, Instagram, consumo estimado y mensaje.

Para enterarte de un lead nuevo hay dos caminos: revisar la colección desde la
consola de Firebase (alcanza mientras el volumen sea bajo), o una Cloud
Function con trigger `onCreate` que mande un mail. Arrancá con lo primero.

### Reglas de seguridad

`firestore.rules` está en la raíz. **Subilas antes de publicar.** Sin reglas,
cualquiera puede escribir en tus colecciones. El criterio es: catálogo de
lectura pública y escritura cerrada; `orders` y `mayorista` se pueden crear
pero no leer, porque tienen datos personales de terceros.

```bash
firebase deploy --only firestore:rules
```

---

## Pagos (Mercado Pago)

El flujo es: se graba la orden en Firestore como `pendiente` → el front le pide
un link de pago a `netlify/functions/create-preference.js` → redirige a
Mercado Pago.

La función existe porque el access token de MP es secreto y no puede estar en
el bundle. Para activarla, en Netlify → Site settings → Environment variables:

```
MP_ACCESS_TOKEN = APP_USR-...     (token de producción de la cuenta de Kuta)
SITE_URL        = https://kutacoffee.netlify.app
```

Si la función no está configurada, devuelve 503 y el front cae en un fallback:
la orden queda guardada igual y se ofrece cerrarla por WhatsApp. Es a propósito
— una venta manual es mejor que una venta perdida.

### Antes de cobrar plata de verdad

1. **Validar precios contra Firestore.** Hoy la función confía en los precios
   que le manda el navegador. Alguien con devtools abierto puede postear un
   buzo a $1. Hay que leer los documentos de `merch` en la función y recalcular
   el total ahí.
2. **Webhook de MP.** Agregar `notification_url` a la preferencia y una segunda
   función que reciba el aviso de pago, marque la orden como `pagada` y recién
   ahí descuente stock. Descontar antes deja stock fantasma cada vez que
   alguien abandona el checkout.

Hasta que estén esas dos cosas, dejá la tienda con el fallback de WhatsApp.

---

## Diseño

Paleta de marca de Kuta (confirmada por el cliente), más dos derivados:

```css
/* Los cinco de la marca */
--verde:      #588157;   /* principal, acentos e interacción      */
--verde-osc:  #3a5a40;   /* bloques y hover                       */
--verde-prof: #344e41;   /* fondos oscuros: nav, hero, pie        */
--salvia:     #a3b18a;   /* líneas, nodos, secundarios            */
--lino:       #dad7cd;   /* bandas claras y texto sobre oscuro    */

/* Dos derivados, no inventados */
--papel: #efeee7;        /* --lino aclarado. Hace falta un segundo claro:
                            una página entera en #dad7cd deja los bloques
                            sin dónde apoyarse, todo al mismo tono.      */
--tinta: #1a1819;        /* único color no blanco de Kuta.ico. Sólo para
                            texto largo, donde el verde oscuro cansa.    */
```

Los componentes no usan esos nombres directamente sino alias semánticos
(`--fondo`, `--texto`, `--oscuro`, `--acento`…). Para recolorear la marca
entera se toca el bloque de color de `src/index.css` y nada más.

### Contraste

Dos tokens se ajustaron por accesibilidad y existen sólo para eso:

| Token | Valor | Por qué |
|---|---|---|
| `--texto-suave` | `#5c6456` | `#6d7566` daba 4.12:1 sobre papel, bajo AA |
| `--salvia-texto` | `#b6bea1` | `--salvia` puro da 3.98:1 sobre `--verde-prof` |

`--salvia` puro se sigue usando para líneas, nodos y bordes, donde no aplica
contraste de texto. Si cambiás la paleta, revisá estos dos.

### Tipografía

El wordmark de Kuta está **pintado a pincel**: trazo grueso (42% de cobertura
de tinta por fila), terminaciones redondeadas, letras levemente torcidas. Una
grotesca comprimida de señalética le peleaba, así que:

- **Fraunces** para títulos, con los ejes `SOFT 60` y `WONK 1`. Esos ejes
  ablandan las terminaciones y desalinean apenas los remates: es lo más cerca
  que se puede estar del pincel sin imitar la letra.
- **Karla** para todo lo demás. Grotesca humanista, cálida, legible en cuerpos
  chicos.

Los títulos van en **caja baja, no en versales**: el wordmark es informal y las
mayúsculas lo vuelven institucional. Las versales quedan sólo para etiquetas
chicas (`.k-label`) y el badge de "sin stock".

Clases utilitarias: `.k-signal`, `.k-label`, `.k-data`, `.k-btn`, `.k-shell`,
`.k-section`.

### Elemento firma

La línea que une los tres locales, en el hero y en `/locales`. Kuta no es un
destino sino una serie de puntos por los que pasás; la línea dice eso.

### Reparto de superficies

Hero y pie en `--verde-prof`, el cuerpo en `--papel`, y la banda de locales de
la home en `--lino`. El orden oscuro → claro → pastel → oscuro evita que el
pie se funda con la sección de arriba.

---

## Qué se sacó del proyecto original

**Componentes eliminados:** `Cart`, `CartItem`, `CartWidget`, `Checkout`,
`CheckoutForm`, `ItemCount`, `Item`, `ItemList`, `ItemListContainer`,
`ItemDetail`, `ItemDetailContainer`, `Menu`, `MoreDetails`, `Header`, `Story`,
`AboutUs`, `HeroSection`.

Buena parte se reescribió con otro nombre y otro alcance; lo que se fue del
todo fue la lógica de pedir café desde la mesa.

**Dependencias eliminadas:** Bootstrap, react-bootstrap, FontAwesome
(reemplazado por SVG inline) y Tailwind. El proyecto tenía Tailwind y CSS
escrito a mano compitiendo por los mismos elementos; ahora es CSS plano con
custom properties.

**Copy corregido:** el `Story` viejo afirmaba "más de una década" y "5000+
clientes felices". Kuta abrió en 2021 y esos números no salían de ningún lado.
En un sitio de cliente, un dato inventado es un pasivo.

---

## Pendientes

- [ ] Subir `firestore.rules` **(antes de publicar)**
- [ ] Configurar `MP_ACCESS_TOKEN` y `SITE_URL` en Netlify
- [ ] Validar precios server-side + webhook de MP antes de cobrar
- [ ] Número real de WhatsApp en `src/data/site.js` (hoy es un placeholder)
- [ ] Dirección y horarios definitivos de Belgrano en `src/data/locales.js`
- [ ] Cargar la colección `merch` con producto y fotos
- [ ] Confirmar con Kuta el origen del café y el método de tostado para el
      bloque "De dónde sale" del Manifiesto (hoy está en términos generales)
- [ ] Conseguir una **versión oscura del logo**: `kuta.png` es off-white y sólo
      funciona sobre fondo oscuro. Hoy se usa en nav y pie (ambos verdes), pero
      cualquier uso sobre claro necesita otro archivo
- [ ] Reemplazar `src/assets/bg.jpg` y las fotos de producto por material propio
      de Kuta (las de `public/` eran placeholders del proyecto original)
