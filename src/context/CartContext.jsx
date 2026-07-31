import { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Carrito — SOLO merch.
 *
 * El menú de cafetería es informativo: no se pide desde la web, se pide en el
 * mostrador. Por eso ningún componente de /menu toca este contexto.
 *
 * Una línea del carrito se identifica por producto + talle, no solo por id:
 * un buzo M y uno L son dos líneas distintas del mismo producto.
 */

const STORAGE_KEY = 'kuta.cart.v1';

export const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart tiene que usarse dentro de <CartProvider>');
  return ctx;
};

const lineKey = (id, talle) => `${id}::${talle ?? '-'}`;

const leerStorage = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(leerStorage);

  // El carrito sobrevive al refresh. Sin esto, volver de Mercado Pago
  // significa perder la compra.
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* modo incógnito o storage lleno: seguimos sin persistir */
    }
  }, [cart]);

  const addItem = (item, cantidad = 1, talle = null) => {
    const key = lineKey(item.id, talle);
    setCart((prev) => {
      const existente = prev.find((l) => l.key === key);
      if (existente) {
        return prev.map((l) =>
          l.key === key
            ? { ...l, cantidad: Math.min(l.cantidad + cantidad, item.stock || 99) }
            : l
        );
      }
      return [
        ...prev,
        {
          key,
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          imagen: item.imagen,
          stock: item.stock,
          talle,
          cantidad,
        },
      ];
    });
  };

  const setCantidad = (key, cantidad) => {
    setCart((prev) =>
      cantidad <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) =>
            l.key === key ? { ...l, cantidad: Math.min(cantidad, l.stock || 99) } : l
          )
    );
  };

  const removeItem = (key) => setCart((prev) => prev.filter((l) => l.key !== key));

  const clearCart = () => setCart([]);

  const total = useMemo(
    () => cart.reduce((acc, l) => acc + l.precio * l.cantidad, 0),
    [cart]
  );

  const cantidadTotal = useMemo(
    () => cart.reduce((acc, l) => acc + l.cantidad, 0),
    [cart]
  );

  const value = {
    cart,
    addItem,
    setCantidad,
    removeItem,
    clearCart,
    total,
    cantidadTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
