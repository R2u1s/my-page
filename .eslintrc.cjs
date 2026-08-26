/** Единая корневая ESLint-конфигурация монорепозитория (конституция, раздел "Качество кода"). */
module.exports = {
  root: true,
  env: { es2022: true, node: true, browser: true },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  plugins: ["@typescript-eslint", "boundaries"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  ignorePatterns: ["**/dist/**", "**/build/**", "**/node_modules/**", "**/generated/**"],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
  overrides: [
    {
      // Feature-Sliced Design: направление импортов на фронтенде (конституция, принцип III)
      files: ["apps/frontend/src/**/*.{ts,tsx}"],
      settings: {
        "boundaries/elements": [
          { type: "app", pattern: "apps/frontend/src/app/*" },
          { type: "pages", pattern: "apps/frontend/src/pages/*" },
          { type: "widgets", pattern: "apps/frontend/src/widgets/*" },
          { type: "features", pattern: "apps/frontend/src/features/*" },
          { type: "entities", pattern: "apps/frontend/src/entities/*" },
          { type: "shared", pattern: "apps/frontend/src/shared/*" },
        ],
      },
      plugins: ["boundaries"],
      rules: {
        "boundaries/element-types": [
          "error",
          {
            default: "disallow",
            rules: [
              { from: "app", allow: ["pages", "widgets", "features", "entities", "shared"] },
              { from: "pages", allow: ["widgets", "features", "entities", "shared"] },
              { from: "widgets", allow: ["features", "entities", "shared"] },
              { from: "features", allow: ["entities", "shared"] },
              { from: "entities", allow: ["shared"] },
              { from: "shared", allow: [] },
            ],
          },
        ],
      },
    },
    {
      // NestJS: декораторы классов активно используют пустые конструкторы DI
      files: ["apps/backend/src/**/*.ts"],
      rules: {
        "@typescript-eslint/no-empty-function": "off",
      },
    },
  ],
};
