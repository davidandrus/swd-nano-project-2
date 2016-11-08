var path = require('path');
var DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = {
  devtool: '#source-map',
  entry: ['./src/'],
  plugins: [
    new DashboardPlugin()
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  module: {
    loaders: [{
      test: /\.(js)?/,
      loaders: ['babel'],
      include: path.join(__dirname, 'src'),
    }],
  },
};
