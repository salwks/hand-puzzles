import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import { resolve } from 'path';
export default defineConfig({
  plugins: [glsl()],
  build: {
    outDir: 'dist-embed', emptyOutDir: true, minify: true,
    lib: { entry: resolve(__dirname, 'embed/splash_tank.ts'), formats: ['es'], fileName: () => 'splash-tank.js' },
  },
});
