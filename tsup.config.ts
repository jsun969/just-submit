import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/vanilla.ts', 'src/react.ts'],
  format: ['cjs', 'esm', 'iife'],
  platform: 'browser',
  dts: true,
  splitting: false,
  clean: true,
  minify: true,
});
