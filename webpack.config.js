const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/frontend/js/main.js",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  mode: "development",
  watch: true,
  plugins: [new MiniCssExtractPlugin({ filename: "[name].css" })],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
};
