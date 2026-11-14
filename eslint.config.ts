import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["tests/**/*", "dist/**/*"],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ["./src/**/*.ts"],
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
