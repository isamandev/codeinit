// @ts-check
import tsEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";
import fsdPlugin from "eslint-plugin-fsd-lint";

// Shared options for rules that need to know the FSD layer structure.
// Used in 4 rules below — extracted to avoid repeating the same object.
const fsdOptions = {
  rootPath: "/src/",
  tsconfigPath: "./tsconfig.json",
  alias: { value: "@", withSlash: true },
  layers: {
    app:      { pattern: "_app" },
    pages:    { pattern: "_pages" },
    widgets:  { pattern: "widgets" },
    features: { pattern: "features" },
    entities: { pattern: "entities" },
    shared:   { pattern: "shared" },
  },
};

export default [
  ...tsEslint.configs["flat/recommended"],
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: ["@features/*/*/*"],
        },
      ],
    },
  },
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    plugins: { fsd: fsdPlugin },
    rules: {
      // Layer hierarchy: lower layers cannot import from higher ones
      "fsd/forbidden-imports": ["error", fsdOptions],

      // No cross-slice imports (features/auth cannot import from features/posts)
      "fsd/no-cross-slice-dependency": ["error", fsdOptions],

      // All imports must go through index.ts public API, not deep paths
      "fsd/no-public-api-sidestep": ["error", fsdOptions],

      // Business logic (model/api/lib) must not import UI
      "fsd/no-ui-in-business-logic": ["error", fsdOptions],

      // Warn about relative imports between layers (use @/ alias instead)
      "fsd/no-relative-imports": "warn",

      // Warn on disordered imports
      "fsd/ordered-imports": "warn",
    },
  },
];
