require('dotenv').config();

const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');
const path = require('path');


/**
 *
 * Loaders
 *
 */

const JS_LOADER = {
    test: /\.jsx?$/,
    include: [path.resolve(__dirname, "src")],
    loaders: ['babel']
};

const JSON_LOADER = {
    test: /\.json$/,
    loader: 'json-loader'
};

const development = {
    devtool: 'source-map',
    entry: './src/index.js',
    output: {
        path: './dist',
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    resolve: {
        extensions: ['', '.jsx', '.js'],
        modulesDirectories: ['/fake-directory-dont-create-a-directory-here'],
        root: [path.resolve(__dirname, './src'), path.resolve(__dirname, './node_modules')],
        alias: {
            'enty-example': path.resolve(__dirname, "../")
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || "development")
        })
    ],
    module: {
        loaders: [
            JS_LOADER,
            JSON_LOADER,
            {
                test: /\.scss$/,
                loaders: ["style-loader?sourceMap", "css-loader?sourceMap", "postcss-loader?sourceMap", "sass-loader?sourceMap"]
            }
        ]
    },
    postcss : function() {
        return [autoprefixer({browsers : ['ie >= 9', 'last 2 versions']})]
    },
    sassLoader: {
        includePaths: [path.resolve(__dirname, "node_modules")]
    },
    devServer : {
        host: '0.0.0.0',
        publicPath : '/dist/',
        port: process.env.PORT || 3000,
        historyApiFallback: true
    }
};


const production = Object.assign({}, development, {
    devtool: undefined,
    cache: false,
    plugins: [
        new ExtractTextPlugin('style.css'),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin()
    ].concat(development.plugins),
    module: {
        loaders: [
            JS_LOADER,
            JSON_LOADER,
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("css-loader!postcss-loader!sass-loader")
            }
        ]
    },
});

module.exports = process.env.NODE_ENV === 'production' ? production : development;
