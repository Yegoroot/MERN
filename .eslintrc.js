module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  extends: "eslint:recommended",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "no-unused-vars": "warn", // не используеммые переменные,
    indent: ["error", "tab"],
    "linebreak-style": ["error", "windows"],
    quotes: ["error", "single"],
    semi: ["error", "never"],
    "no-multiple-empty-lines": ["warn", { max: 1, maxEOF: 1 }] // пустые строки
  }
};
