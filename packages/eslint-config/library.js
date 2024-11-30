const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "prettier",
    "turbo",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  plugins: ["prettier", "import", "eslint-plugin-import-helpers"],
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
      node: true,
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
  ],
  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
    },
  ],
  rules: {
    "prettier/prettier": ["error"],
    "import/prefer-default-export": "off",
    "import/no-unresolved": "error",
    "no-shadow": "off",
    "no-console": "warn",
    semi: ["error", "always"],
    "max-len": [
      "error",
      {
        code: 80,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      },
    ],
    "linebreak-style": ["error", "unix"],
    "import/extensions": ["error"],
    "import/no-extraneous-dependencies": ["error"],
    "@typescript-eslint/no-use-before-define": ["error"],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": ["error"],
    "@typescript-eslint/triple-slash-reference": ["error", { path: "always" }],
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "class-methods-use-this": "off",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "interface",
        format: ["PascalCase"],
        custom: {
          regex: "(^I)|(Request|User|ProcessEnv)",
          match: true,
        },
      },
    ],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "import-helpers/order-imports": [
      "warn",
      {
        newlinesBetween: "always",
        groups: ["module", "/^~/", ["parent", "sibling", "index"]],
        alphabetize: {
          order: "asc",
          ignoreCase: true,
        },
      },
    ],
  },
};
