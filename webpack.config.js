var path = require('path');
var webpack = require('webpack')

module.exports = {
    entry: './src/main/javascript/app.js',
    mode: 'development',
    cache: true,
    output: {
        path: __dirname,
        filename: './src/main/resources/static/built/bundle.js'
    },
    module: {
        rules: [{
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['babel-preset-es2015', 'react']
                }
            }
        }, {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            "React": "react"
        })
    ]
};
