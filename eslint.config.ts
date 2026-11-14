import js from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  {
    ignores: ["tests/**/*", "out/**/*"],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["**/*.ts"],
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/order": [
        "error",
        {
          alphabetize: { order: "asc" },
        },
      ],
      "prefer-arrow-callback": "error",
    },
  },

  eslintPluginPrettierRecommended,

  {
    rules: {
      "prettier/prettier": "warn",
    },
  },
];
