import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['__test__/**/*.test.ts'],
    coverage: {
      include: ['packages/client/src/**/*.ts'],
    },
  },
});
