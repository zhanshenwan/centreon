process.env.NODE_ENV = "production";
var reactScriptsConfig = require("react-scripts/config/webpack.config.prod");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');

reactScriptsConfig.plugins = [
  new HtmlWebpackPlugin({
    inject: true,
    template: __dirname + "/src/template/index.html",
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    },
    baseUrl: '/monitoring/'
  }),
  new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
  //new ModuleNotFoundPlugin('.'),
  new MiniCssExtractPlugin({
    filename: 'static/css/[name].[contenthash:8].css',
    chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
  }),
].filter(Boolean)

module.exports = Object.assign({}, reactScriptsConfig, {
  entry: ["@babel/polyfill", __dirname + "/src/index.js"],
  output: Object.assign({}, reactScriptsConfig.output, {
    path: __dirname + "/../"
  }),
  /*
  plugins: [
    ...reactScriptsConfig.plugins.slice(0,1),
    new BaseHrefWebpackPlugin({ baseHref: '/monitoring/' }),
    ...reactScriptsConfig.plugins.slice(1)
  ]
  */
});
