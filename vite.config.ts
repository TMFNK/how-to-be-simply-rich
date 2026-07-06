import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/how-to-be-simply-rich/' : '/',
}));
