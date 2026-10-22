import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "dist/**",
    "src/**",
    "vite.config.ts",
    "index.html",
    "tsconfig.app.json",
    "tsconfig.node.json",
  ]),
]);
