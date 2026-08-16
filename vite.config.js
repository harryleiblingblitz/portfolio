import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Reference PDFs/docs get dropped straight into the project root (and
    // may be mid-sync via cloud storage, which locks them) — Vite doesn't
    // need to watch them, and watching them can crash the dev server.
    watch: {
      ignored: ['**/*.pdf', '**/*.docx', '**/*.doc', '**/*.xlsx', '**/Projects/**', '**/About Me/**', '**/CV/**'],
    },
  },
});
