/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // tslint:disable-line: no-var-requires
import * as webpack from 'webpack';
import { merge } from 'webpack-merge';
import common from './webpack.common';
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // tslint:disable-line: no-var-requires
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // tslint:disable-line: no-var-requires

const config: webpack.Configuration = merge(common, {

    mode: 'production',

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: 'ts-loader' },
            {
                test: /.s?css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            }
        ]
    },

    optimization: {
        minimizer: [new CssMinimizerPlugin({})]
    },

    plugins: [
        // new BundleAnalyzerPlugin(),
        new MiniCssExtractPlugin({
            // // Options similar to the same options in webpackOptions.output
            // // all options are optional
            // chunkFilename: '[id].[hash].optimize.css',
            // filename: '[name].[hash].optimize.css',
            // ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        new webpack.NormalModuleReplacementPlugin(
            /(.*)appConfig.ENV(\.*)/,
            resource => resource.request = resource.request.replace(/ENV/, 'electron')
        )
    ]
});

export default config;
