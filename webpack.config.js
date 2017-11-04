'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const { mapConfigToTargets } = require('./utils/env-bundles');

module.exports = mapConfigToTargets(({ browsers, id }) => {
  return {
    entry: [
      path.join(__dirname, 'app/main.js')
    ],
    output: {
      path: path.join(__dirname, '/dist/', id),
      filename: '[name].js',
      publicPath: '/'
    },
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.NoErrorsPlugin(),
      new HtmlWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development')
      })
    ],
    module: {
      rules: [{
        test: /\.js/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          "presets": [["env", {
            targets: {
              browsers
            }
          }]]
        }
      }, {
        test: /\.json?$/,
        loader: 'json'
      }, {
        test: /\.css$/,
        loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]'
      }, {
        test: /\.html$/,
        loader: 'html'
      }]
    }
  };
})
