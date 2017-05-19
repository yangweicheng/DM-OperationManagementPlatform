var webpack = require("webpack");
var path = require("path");
var glob = require('glob');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = {
    entry: {
        "js/index": [
            "./app/index/js/index.js"
        ],
        "js/vendor": [
            'vue', 'vue-router', 'vue-resource','jquery'
        ]
    },
    output: {
        path: path.resolve(__dirname, './dist/'),
        publicPath: './',
        filename: '[name].js'
    },
    module: {
        rules: [

            //解析.vue结尾的文件
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
                exclude: '/node_modules/'
            },

            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                loader: 'file-loader?limit=81920&&name=imgs/[hash:8].[name].[ext]'

            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: "app/index/index.html",
            inject: true
        }),
        new CommonsChunkPlugin({
            name: 'js/vendor',
            minChunks: Infinity

        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    resolve: {
        extensions: ['.js', '.vue']
    }
}
