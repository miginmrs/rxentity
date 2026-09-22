import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'source/index.ts',
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  platform: 'neutral',
  target: 'es2022',
  hash: false,
  fixedExtension: true,
  publint: true,
  attw: {
    profile: 'node16',
    level: 'error',
  },
});
