import { defineConfig } from "vite";
import { resolve } from "path";
import copy from "rollup-plugin-copy";

export default defineConfig({
  build: {
    target: "es2018",
    outDir: "dist",
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      plugins: [
        copy({
          targets: [
            { src: "src/*.json", dest: "dist" },
            { src: "src/*.html", dest: "dist" },
            { src: "src/assets", dest: "dist" },
          ],
          hook: "writeBundle",
        }),
      ],
      input: {
        background: "src/background.js",
        content: "src/content.js",
        popup: "src/popup.js",
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name][extname]",
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
  },
});
