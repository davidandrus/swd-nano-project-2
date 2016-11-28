var path = require('path');
var DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = {
  devtool: '#source-map',
  entry: {
    main: './src/index.js',
    sw: './src/sw.js',
  },
  plugins: [
    new DashboardPlugin()
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
    }],
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js',
    }
  }
};
