import dts from "vite-plugin-dts";
import path from "path";
import solidPlugin from 'vite-plugin-solid';
import { defineConfig, UserConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [solidPlugin(), dts({ rollupTypes: true })],
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "mylib",
      formats: ["es", "cjs", "umd", "iife"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["solid-js"]
    },
  },
} satisfies UserConfig);
