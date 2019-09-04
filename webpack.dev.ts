/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import BundleAnalyzerPlugin from 'webpack-bundle-analyzer';
import WebpackShellPlugin from 'webpack-shell-plugin';
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import * as path from 'path';
import common from './configs/webpack.common';
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // tslint:disable-line: no-var-requires

const config: webpack.Configuration = merge(common, {

    mode: 'development',

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
            {
                test: /\.(scss|css)$/,
                use: [
                    { loader: 'style-loader'},
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: true}},
                    { loader: 'sass-loader', options: {sourceMap: true}}]
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            chunkFilename: '[id].css',
            filename: '[name].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
    ],

    devServer: {
        compress: true,
        historyApiFallback: true,
    }
});

export default config;
