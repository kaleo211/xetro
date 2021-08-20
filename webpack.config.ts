import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const webpackConfig: webpack.Configuration = {
  entry: './app/index.js',
  mode: 'development',
  output: {
    path: __dirname + '/dist/app',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
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
  ],
}

export default webpackConfig;
