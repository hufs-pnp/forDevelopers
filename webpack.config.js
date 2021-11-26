const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BASE_URL = "./src/frontend/js/";

module.exports = {
  entry: {
    main: BASE_URL + "main.js",
    pagination: BASE_URL + "pagination.js",
    recruitmentPost: BASE_URL + "projects/recruitmentPost.js",
    orderPost: BASE_URL + "projects/orderPost.js",
    communityPost: BASE_URL + "/communities/communityPost.js",
  },
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  mode: "development",
  watch: true,
  plugins: [new MiniCssExtractPlugin({ filename: "css/[name].css" })],
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
