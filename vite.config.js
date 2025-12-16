import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path: Ajuste isso se for hospedar em um subdiretório (ex: '/minha-loja/')
  // Para domínio raiz (ex: minha-loja.com), deixe como '/'
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Desativa sourcemaps em produção para economizar espaço e segurança
    minify: 'terser', // Garante minificação eficiente
  },
  server: {
    port: 3000,
    open: true
  }
})