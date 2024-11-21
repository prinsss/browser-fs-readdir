import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/lib/index.ts'],
  outDir: 'lib',
  sourcemap: true,
  clean: true,
  dts: true,
  format: ['cjs', 'esm'],
});
