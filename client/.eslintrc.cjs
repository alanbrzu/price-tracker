require("@uniswap/eslint-config/load");

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: "@uniswap/eslint-config/react",
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': 'off',
    'import/no-unused-modules': 'off',
    'react/no-unescaped-entities': 'off',
    'unused-imports/no-unused-imports': 'off',
  },
};
