import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: false,
  },
  build: {
    target: 'ES2022',
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  resolve: {
    alias: {
      '@scenes': path.resolve(__dirname, './src/scenes'),
      '@assets': path.resolve(__dirname, './public/assets'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
});
