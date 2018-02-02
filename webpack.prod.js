const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = merge(common, {
  plugins: [
    new webpack.DefinePlugin({
      'env.apiUrl': JSON.stringify('https://api.imp.centreon.com/api')
    }),
    new UglifyJSPlugin()
  ]
})