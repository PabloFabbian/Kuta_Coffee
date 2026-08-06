import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  server: {
    // Mismo puerto que usaba CRA, para no cambiar la costumbre.
    port: 3000,
    open: true,
  },

  build: {
    // Vite escribe en dist/ por defecto. Lo dejamos en build/ porque es lo que
    // espera el proyecto de Vercel ya configurado y lo que dice .gitignore.
    outDir: 'build',

    rollupOptions: {
      output: {
        // Firebase y framer-motion son las dependencias más pesadas. En chunks
        // aparte, un cambio en el código de la app no invalida su caché.
        manualChunks: {
          firebase: ['firebase/app', 'firebase/firestore'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
