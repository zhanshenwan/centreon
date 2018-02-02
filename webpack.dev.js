const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    hot: true,
    port: 4000,
    contentBase: path.resolve(__dirname, 'build'),
    publicPath: '/',
    historyApiFallback: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'env.apiUrl': JSON.stringify('http://middleware:3000/api')
    })
  ]
})