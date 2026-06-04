// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   base: '/restaurant-ai-platform/',
//   server: {
//     host: 'localhost',
//     port: 5176,
//   },
// })


// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/restaurant-ai-platform/', // Match your deploy path
  publicDir: 'public', // silent-check-sso.html goes here
  server: {
    host: 'localhost',
    port: 5176,
    strictPort: true, // Fail if port 5176 is occupied
    cors: {
      origin: ['http://localhost:8180'], // Allow Keycloak callbacks
      credentials: true,
    },
  },
});