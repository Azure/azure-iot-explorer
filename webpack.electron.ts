/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as webpack from 'webpack';
import * as merge from 'webpack-merge';
import common from './webpack.common';
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // tslint:disable-line: no-var-requires
const TerserPlugin = require('terser-webpack-plugin'); // tslint:disable-line: no-var-requires
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // tslint:disable-line: no-var-requires

const config: webpack.Configuration = merge(common, {

    mode: 'production',

    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader' },
            {
                test: /\.(scss|css)$/,
                use: [
                    { loader: 'style-loader'},
                    MiniCssExtractPlugin.loader,
                    { loader: 'css-loader', options: { sourceMap: false}},
                    { loader: 'sass-loader', options: {sourceMap: false, implementation: require('sass')}}]
            }
        ]
    },

    optimization: {
        minimizer: [
            new TerserPlugin(),
            new CssMinimizerPlugin({
                minimizerOptions: {         
                    preset: [
                        "default",
                        {
                            discardComments: { removeAll: true },
                        },
                    ],
                },
            })]
    },

    plugins: [
        // new BundleAnalyzerPlugin(),
        new MiniCssExtractPlugin({
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
        new webpack.NormalModuleReplacementPlugin(
            /(.*)appConfig.ENV(\.*)/,
            resource => resource.request = resource.request.replace(/ENV/, 'electron')
        )
    ]
});

export default config;
