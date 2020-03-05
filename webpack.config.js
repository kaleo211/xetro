const config = require('config');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const definePlugin = new webpack.DefinePlugin({
  SSO_CLIENT_ID: JSON.stringify(config.get('sso.microsoft.client_id')),
  SSO_TENANT_ID: JSON.stringify(config.get('sso.microsoft.tenant_id')),
  SSO_REDIRECT_URL: JSON.stringify(config.get('sso.microsoft.redirect_uri')),
  SSO_ADDRESS: JSON.stringify(config.get('sso.microsoft.address')),
});

module.exports = {
  entry: './app/index.js',
  mode: 'development',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new HtmlWebpackPlugin({
      template: 'app/public/index.html',
    }),
    definePlugin,
  ],
  optimization: {
    minimize: true,
  },
};
