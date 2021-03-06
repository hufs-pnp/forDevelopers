const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BASE_URL = "./src/frontend/js/";

module.exports = {
  entry: {
    main: BASE_URL + "main.js",
    header: BASE_URL + "header.js",
    home: BASE_URL + "home.js",
    pagination: BASE_URL + "pagination.js",
    previewImage: BASE_URL + "previewImage.js",
    join: BASE_URL + "join.js",
    login: BASE_URL + "login.js",
    profile: BASE_URL + "profile.js",
    profileUpdate: BASE_URL + "profileUpdate.js",
    changePassword: BASE_URL + "changePassword.js",
    findPassword: BASE_URL + "findPassword.js",
    board: BASE_URL + "board.js",
    article: BASE_URL + "article.js",
  },
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
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
