var path = require('path');
var DashboardPlugin = require('webpack-dashboard/plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: '#source-map',
  entry: {
    main: './src/index.js',
    sw: './src/sw.js',
  },
  plugins: [
    new ExtractTextPlugin("[name].css"),
    new DashboardPlugin(),
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/static/',
  },
  module: {
    loaders: [{
      test: /\.(js)?/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src'),
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract("style-loader", "css-loader")
    }, {
      test: /\.html$/,
      loaders: ['html'],
    }],
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js',
    }
  }
};
