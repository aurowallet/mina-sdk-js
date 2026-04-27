const path = require("path");

const config = {
  entry: "./src/index.js", // Entry point of your application
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "provider.js", // Output file
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Matches any JavaScript file
        // exclude: /node_modules/, // Excludes the node_modules directory
        exclude: /node_modules\/(?!mina-signer)/, // Transpile mina-signer as well
        use: {
          loader: "babel-loader", // Uses babel-loader for transpiling ES6+ to ES5
          // presets/plugins are sourced from .babelrc so that
          // `useBuiltIns: "usage"` + corejs polyfill injection actually applies.
        },
      },
    ],
  },
  // The node configuration below might not be necessary unless you're dealing with specific node shims.
  node: false,
};

module.exports = config;
