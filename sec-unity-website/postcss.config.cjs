// Use CommonJS to ensure Vite/PostCSS reliably loads the config in all environments
// (especially when `type: module` is set in package.json)
module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
