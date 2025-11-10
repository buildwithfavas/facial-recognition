import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE || '/';
  return {
    base,
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor libraries into separate chunks
            'react-vendor': ['react', 'react-dom', 'react-redux'],
            'redux-vendor': ['@reduxjs/toolkit'],
            'bootstrap-vendor': ['react-bootstrap', 'bootstrap'],
            // Face-api is large, give it its own chunk
            'face-api': ['@vladmandic/face-api'],
          },
        },
      },
      // Increase chunk size warning limit since ML libraries (TensorFlow.js + face-api) are inherently large
      // The face-api chunk will be ~1.3MB due to ML models - this is expected and acceptable
      chunkSizeWarningLimit: 1500,
    },
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.{test,spec}.ts', 'src/**/*.{test,spec}.tsx'],
      testTimeout: 10000,
    },
  };
});
