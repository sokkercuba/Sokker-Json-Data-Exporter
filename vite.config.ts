import react from "@vitejs/plugin-react";
import viteCompression from "vite-plugin-compression";
import { defineConfig, splitVendorChunkPlugin } from "vite";

export default defineConfig({
  plugins: [
    react({
      babel: {
        babelrc: true,
      },
    }),
    viteCompression(),
    splitVendorChunkPlugin(),
  ],
  build: {
    minify: "terser",
  },
});
