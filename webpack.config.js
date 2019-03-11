var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
var config = require('config');

const definePlugin = new webpack.DefinePlugin({
    CLIENT_ID: JSON.stringify(config.get('microsoft.client_id')),
    TENANT_ID: JSON.stringify(config.get('microsoft.tenant_id')),
    REDIRECT_URL: JSON.stringify(config.get('microsoft.redirect_uri')),
    SCOPES: JSON.stringify(config.get('microsoft.scopes')),
});

module.exports = {
    entry: './app/index.js',
    mode: 'development',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: { loader: 'babel-loader' }
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
            template: 'app/public/index.html',
        }),
        definePlugin,
    ]
};
