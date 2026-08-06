/**
 * Variantes compartidas de framer-motion.
 *
 * Están todas acá para que el sitio se mueva de una sola manera: si cada
 * componente define su propia duración, el resultado se siente descoordinado.
 *
 * Criterio de duraciones: 0.25s para lo que responde a un click (tiene que
 * sentirse inmediato), 0.5s para lo que aparece al hacer scroll (tiene que
 * dar tiempo a notarlo sin frenar la lectura).
 */

export const SUAVE = [0.22, 0.61, 0.36, 1];

/** Entrada de página. Muy corta: una transición larga entre rutas se siente lenta. */
export const pagina = {
  inicial: { opacity: 0, y: 8 },
  animar: { opacity: 1, y: 0, transition: { duration: 0.25, ease: SUAVE } },
  salir: { opacity: 0, y: -8, transition: { duration: 0.15, ease: SUAVE } },
};

/** Bloque que aparece al entrar en pantalla. */
export const revelar = {
  inicial: { opacity: 0, y: 24 },
  animar: { opacity: 1, y: 0, transition: { duration: 0.5, ease: SUAVE } },
};

/** Contenedor que escalona a sus hijos. */
export const escalonar = (retraso = 0.06) => ({
  inicial: {},
  animar: { transition: { staggerChildren: retraso } },
});

/** Ítem de una lista escalonada. */
export const item = {
  inicial: { opacity: 0, y: 16 },
  animar: { opacity: 1, y: 0, transition: { duration: 0.4, ease: SUAVE } },
};

/** Config de whileInView reutilizable: una sola vez y con margen de anticipo. */
export const enVista = { once: true, margin: '-60px' };
