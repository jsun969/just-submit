import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'iife'],
  platform: 'browser',
  dts: true,
  sourcemap: true,
  splitting: false,
  clean: true,
  minify: true,
  globalName: 'JustSubmit',
});
