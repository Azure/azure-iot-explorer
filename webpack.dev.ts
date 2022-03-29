/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import { Configuration as WebpackConfig, NormalModuleReplacementPlugin } from 'webpack';
import { Configuration as WebpackDevServerConfig } from "webpack-dev-server";
import { merge } from 'webpack-merge';
import common from './webpack.common';
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // tslint:disable-line: no-var-requires

interface Config extends WebpackConfig {
    devServer?: WebpackDevServerConfig
}

const config: Config = merge(common, {

    mode: 'development',

    // Enable sourcemaps for debugging webpack's output.
    devtool: 'source-map',

    module: {
        rules: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader', exclude: /node_modules/ },
            {
                test: /\.(scss|css)$/,
                use: [
                    { loader: 'style-loader'},
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: true}},
                    { loader: 'sass-loader', options: {sourceMap: true, implementation: require('sass')}}]
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
        new NormalModuleReplacementPlugin(
            /(.*)appConfig.ENV(\.*)/,
            resource => resource.request = resource.request.replace(/ENV/, 'dev')
        )
    ],

    devServer: {
        compress: true,
        historyApiFallback: true,
    }
});

export default config;
