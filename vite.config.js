import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { generateIndexPHP } from "./generate-php";
import { fileURLToPath } from "url";
import path from "path";

// Define __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const isDark = mode === "dark";
  const buildDir = isDark ? "build/build-dark" : "build/build-light";

  return {
    plugins: [
      react({
        // Use automatic JSX runtime for smaller bundle
        jsxRuntime: 'automatic',
      }),
      viteSingleFile({
        removeViteModuleLoader: true,
      }),
      {
        name: "generate-index-php",
        apply: "build",
        closeBundle() {
          const buildPath = path.resolve(__dirname, buildDir);
          generateIndexPHP(buildPath);
        },
      },
    ],
    build: {
      outDir: buildDir,
      sourcemap: false,
      target: "esnext",
      assetsInlineLimit: 100000000,
      cssCodeSplit: false,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          dead_code: true,
          unused: true,
          passes: 2,
        },
        mangle: {
          toplevel: true,
        },
        format: {
          comments: false,
        },
      },
      // Report compressed size
      reportCompressedSize: true,
      // Chunk size warning limit
      chunkSizeWarningLimit: 500,
    },
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
    define: {
      __THEME_MODE__: JSON.stringify(mode),
    },
    // Optimize server for dev
    server: {
      warmup: {
        clientFiles: ["./src/main.jsx", "./src/App.jsx"],
      },
    },
  };
});