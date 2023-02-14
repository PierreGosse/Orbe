const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const svelte = require('svelte');
const autoPreprocess = require('svelte-preprocess');

console.log(process.env.NODE_ENV)
const mode = process.env.NODE_ENV || "development";
const prod = mode === "production";

module.exports = {
  entry: {
    bundle: ["./src/main.js"]
  },
  resolve: {
    alias: {
      svelte: path.resolve("../node_modules", "svelte")
    },
    extensions: [".mjs", ".js", ".ts", ".svelte"],
    mainFields: ["svelte", "browser", "module", "main"],
    fallback: { "console": false }
  },
  output: {
    path: __dirname + "/public",
    filename: "[name].js",
    chunkFilename: "[name].[id].js"
  },
  module: {
    rules: [
      {
        test: /src\/imgs\/.*svg$/i,
        use: 'raw-loader',
      },
      {
        test: /\.svelte$/,
        use: {
          loader: "svelte-loader",
          options: {
            emitCss: true,
            hotReload: true,
            preprocess: autoPreprocess()
          }
        }
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          /**
           * MiniCssExtractPlugin doesn't support HMR.
           * For developing, use 'style-loader' instead.
           * */
          prod ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader"
        ]
      }
    ]
  },
  mode,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3210',
        pathRewrite: { '^/api': '' },
      },
    },
    compress: true,
    port: 9000,
  },
  devtool: prod ? false : "source-map"
};
