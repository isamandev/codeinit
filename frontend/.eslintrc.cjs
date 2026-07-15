module.exports = {
  root: true,
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  env: { browser: true, node: true, es2021: true },
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: ["@features/*/*/*"],
      },
    ],
  },
  settings: {},
};
