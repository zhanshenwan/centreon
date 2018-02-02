const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  resolve: {
    alias: {
      App: path.resolve(__dirname, 'src/client/app/'),
      Components: path.resolve(__dirname, 'src/client/components/'),
      Services: path.resolve(__dirname, 'src/client/services/'),
      Pages: path.resolve(__dirname, 'src/client/pages/'),
      Redux: path.resolve(__dirname, 'src/client/redux/'),
    },
  },
  entry: [
    path.join(__dirname, 'src/client/index.js')
  ],
  output: {
    //path: path.join(__dirname, 'build'),
    path: '/usr/share/centreon/www/',
    filename: '[name].js',
    publicPath: '/centreon/'
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  'env',
                  {
                    modules: false
                  }
                ],
                'stage-0',
                'react'
              ],
              plugins: [
                'transform-decorators-legacy',
                'transform-class-properties'
              ]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.svg$/,
        use: 'url-loader?limit=10000&mimetype/svg+xml'
      },
      {
        test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
        use: 'file-loader'
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              query: {
                name: './static/images/[name].[ext]'
              }
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              query: {
                mozjpeg: {
                  progressive: true,
                },
                gifsicle: {
                  interlaced: true,
                },
                optipng: {
                  optimizationLevel: 7,
                }
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['build/*']),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, 'www/include/core/menu/templates/BlockHeader.ihtml'),
      filename: '/usr/share/centreon/www/include/core/menu/templates/BlockHeader.ihtml',
//      template: path.join(__dirname, 'src/client/index.html')
    })
  ]
}
