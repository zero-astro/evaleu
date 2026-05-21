import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    conditions: ['browser', 'default'],
    alias: {
      $lib: path.resolve('./src/lib'),
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}', 'tests/**/*.test.{js,ts}'],
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
});
