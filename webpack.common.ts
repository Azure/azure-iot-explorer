import * as webpack from 'webpack';
import * as path from 'path';
const HtmlWebpackPlugin = require('html-webpack-plugin'); // eslint-disable-line @typescript-eslint/no-var-requires
const CopyPlugin = require('copy-webpack-plugin'); // eslint-disable-line @typescript-eslint/no-var-requires
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin'); // eslint-disable-line @typescript-eslint/no-var-requires
const ESLintPlugin = require('eslint-webpack-plugin'); // eslint-disable-line @typescript-eslint/no-var-requires
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
            'process.env.userdnsdomain': JSON.stringify(process.env.userdnsdomain),
          }),
        new ESLintPlugin({
            extensions: ['ts', 'tsx'],
            failOnError: false,
            emitWarning: true,
        })
    ],
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    ignoreWarnings: [
        // protobufjs uses dynamic require() — safe to ignore
        { module: /@protobufjs[\\/]inquire/ }
    ]
};

export default config;
