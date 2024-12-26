/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["./react.js"],
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": "warn",
  },
};
