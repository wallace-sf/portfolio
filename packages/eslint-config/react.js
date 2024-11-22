const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "eslint-config-turbo",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react-perf/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  plugins: [
    "only-warn",
    "@typescript-eslint",
    "react",
    "prettier",
    "eslint-plugin-import-helpers",
    "import",
    "react-hooks",
    "react-perf",
    "jsx-a11y",
  ],
  rules: {
    "prettier/prettier": ["error"],
    "linebreak-style": ["error", "unix"],
    "max-len": [
      "error",
      {
        code: 80,
        ignoreStrings: true,
        ignoreComments: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    "import-helpers/order-imports": [
      "error",
      {
        newlinesBetween: "always",
        groups: ["/^react$/", "module", "/^~/", ["parent", "sibling", "index"]],
        alphabetize: { order: "asc", ignoreCase: true },
      },
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
        json: "always",
        png: "always",
      },
    ],
    "react/react-in-jsx-scope": "off",
    "import/no-extraneous-dependencies": ["error"],
    "@typescript-eslint/no-use-before-define": "error",
    "@typescript-eslint/explicit-function-return-type": "off",
    "no-console": "warn",
    "no-nested-ternary": "off",
    "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "react/prop-types": "off",
    "import/no-unresolved": "error",
    "import/prefer-default-export": "off",
    "import/no-cycle": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/triple-slash-reference": ["error", { path: "always" }],
    "react/button-has-type": "error",
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: {
          arguments: false,
        },
      },
    ],
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
    project: "./tsconfig.json",
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        project,
      },
      node: true,
    },
    react: {
      version: "detect",
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
  ],
  overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }],
};
