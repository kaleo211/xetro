var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/main/javascript/index.js',
    mode: 'development',
    output: {
        path: __dirname,
        filename: './src/main/resources/static/built/bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader'
            }
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            "React": "react"
        }),
        new HtmlWebpackPlugin({
            template: 'src/main/javascript/public/index.html'
        })
    ]
};
