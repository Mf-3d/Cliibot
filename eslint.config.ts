import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  {
    ignores: ["tests/**/*", "out/**/*"],
  },
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      "import/order": [
        "error",
        {
          alphabetize: { order: "asc" },
        },
      ],
      "@typescript-eslint/no-unused-vars": "error",
      "no-unused-vars": "off",
      "prefer-arrow-callback": "error",
    },
  },
]);
