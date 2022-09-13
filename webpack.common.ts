import * as webpack from 'webpack';
import * as path from 'path';
const HtmlWebpackPlugin = require('html-webpack-plugin'); // tslint:disable-line: no-var-requires
const CopyPlugin = require('copy-webpack-plugin'); // tslint:disable-line: no-var-requires
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin'); // tslint:disable-line: no-var-requires
const config: webpack.Configuration = {
    entry: {
        main: ['./src/index.tsx']
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, '.', 'dist'),
        assetModuleFilename: 'images/[name].[ext]'
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'ts-loader', exclude: /node_modules/ },
            {
                exclude: /node_modules/,
                loader: 'tslint-loader',
                test: /\.tsx?$/

            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                type: 'asset/resource'
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
        },
    },
    plugins: [
        new NodePolyfillPlugin(),
        new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '.', 'src', 'index.html')
        }),
        // new BundleAnalyzerPlugin(),
        new CopyPlugin({
            patterns: [
              {
                from: 'images',
                to: 'images',
              }
            ]
        }),
        new webpack.DefinePlugin({
            process: {
              env: {
                userdnsdomain: JSON.stringify(process.env.userdnsdomain),
              },
            },
          })
    ],
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.json']
    }
};

export default config;
