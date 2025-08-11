import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig(({ command, mode }) => {
  const isSingleFileBuild = mode === 'singlefile';

  return {
    base: './',
    plugins: isSingleFileBuild ? [viteSingleFile()] : [],
    build: {
      outDir: isSingleFileBuild ? 'single-index' : '',
    },
  };
})