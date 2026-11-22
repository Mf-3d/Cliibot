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
      "@typescript-eslint/consistent-type-imports": [
        "error", // 'warn' でも可
        {
          prefer: "type-imports", // 型のみ使う場合は import type を強制
          fixStyle: "inline-type-imports", // import { type Foo } 形式（デフォルトは 'separate-type-imports'）
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
