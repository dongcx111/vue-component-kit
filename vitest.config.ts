import { defineConfig } from "vitest/config";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Vue from "@vitejs/plugin-vue";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [Vue()],
  optimizeDeps: {
    disabled: true,
  },
  test: {
    name: "unit",
    globals: true,
    environment: "jsdom",
    include: ["**/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["node_modules", "dist", "**/__snapshots__/**"],
    coverage: {
      reporter: ["text", "html"],
      include: ["packages/**"],
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/__tests__/**",
        "**/*.d.ts",
        "**/*.md",
        "play/**",
        "scripts/**",
      ],
    },
    watch: false,
  },
  resolve: {
    alias: {
      "@vue-component-kit/components": resolve(__dirname, "packages/components"),
      "@vue-component-kit/shared": resolve(__dirname, "packages/shared"),
    },
  },
});
