var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './app/app.jsx',
  output: {path: path.resolve(__dirname, 'assets'), filename: 'js/bundle.js' },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'app'),
        query: {
          presets: ['es2015', 'react'],
          plugins: [require('babel-plugin-transform-object-rest-spread')]
        }
      },
      {
        test: /\.s?css$/,
        include: path.resolve(__dirname, 'app'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]--[hash:base64:5]'
            }
          }, 'sass-loader']
        })
      },
      {
        test: /\.scss$/,
        include: path.resolve('node_modules'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      { 
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
        loader: 'url-loader',
        options: {
          limit: 10000,
          publicPath: '../',
          name: 'fonts/[hash].[ext]',
          mimetype: 'application/font-woff'
        }
      },
      { 
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
        options: {
          publicPath: '../',
          name: 'fonts/[hash].[ext]'
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('css/bundle.css')
  ],
  node: {
    net: 'empty',
    tls: 'empty',
    fs: 'empty'
  }
};