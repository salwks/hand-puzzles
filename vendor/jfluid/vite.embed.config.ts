import { defineConfig } from 'vite';
import { resolve } from 'path';
export default defineConfig({
  define: { __BUILD_TIMESTAMP__: JSON.stringify(new Date().toISOString()) },
  build: {
    outDir: 'dist-embed',
    emptyOutDir: true,
    lib: { entry: resolve(__dirname, 'src/embed/water_tank.ts'), formats: ['es'], fileName: () => 'water-tank.js' },
    minify: true,
  },
});
