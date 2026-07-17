const tsEslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const globals = require("globals");
const fsdPlugin = require("eslint-plugin-fsd-lint");

const fsdOptions = {
  rootPath: "/src/",
  tsconfigPath: "./tsconfig.json",
  alias: { value: "@", withSlash: true },
  layers: {
    app: { pattern: "_app" },
    pages: { pattern: "_pages" },
    widgets: { pattern: "widgets" },
    features: { pattern: "features" },
    entities: { pattern: "entities" },
    shared: { pattern: "shared" },
  },
};

module.exports = [
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
      "fsd/forbidden-imports": ["error", fsdOptions],
      "fsd/no-cross-slice-dependency": ["error", fsdOptions],
      "fsd/no-public-api-sidestep": ["error", fsdOptions],
      "fsd/no-ui-in-business-logic": ["error", fsdOptions],
      "fsd/no-relative-imports": "warn",
      "fsd/ordered-imports": "warn",
    },
  },
];
