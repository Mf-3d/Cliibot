import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

export default [
  {
    ignores: ["tests/**/*", "out/**/*"],
  },
  eslintConfigPrettier,
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      import: importPlugin,
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
];
