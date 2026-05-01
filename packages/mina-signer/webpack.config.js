const path = require("path");
const webpack = require("webpack");

const config = {
  entry: "./src/index.js", // Entry point of your application
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "bridge.js", // Output file
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Matches any JavaScript file
        // exclude: /node_modules/, // Excludes the node_modules directory
        exclude:
          /node_modules\/(?!(mina-signer|@noble|@scure)\/)/, // Transpile mina-signer as well
        use: {
          loader: "babel-loader", // Uses babel-loader for transpiling ES6+ to ES5
          options: {
            presets: ["@babel/preset-env"], // Uses @babel/preset-env preset
          },
        },
      },
    ],
  },
  resolve: {
    fallback: {
      fs: false,
      child_process: false,
      buffer: require.resolve("buffer/"),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new (require("terser-webpack-plugin"))({
        extractComments: false,
      }),
    ],
  },
  // The node configuration below might not be necessary unless you're dealing with specific node shims.
  node: false,
};

module.exports = config;
