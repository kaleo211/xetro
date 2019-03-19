var webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')
var config = require('config');

const definePlugin = new webpack.DefinePlugin({
    SSO_CLIENT_ID: JSON.stringify(config.get('sso.client_id')),
    SSO_TENANT_ID: JSON.stringify(config.get('sso.tenant_id')),
    SSO_REDIRECT_URL: JSON.stringify(config.get('sso.redirect_uri')),
    SSO_ADDRESS: JSON.stringify(config.get('sso.address')),
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
