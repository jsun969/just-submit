import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'iife'],
  platform: 'browser',
  dts: true,
  splitting: false,
  clean: true,
  minify: true,
});
