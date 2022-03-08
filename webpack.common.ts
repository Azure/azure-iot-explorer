import * as webpack from 'webpack';
import * as path from 'path';
const HtmlWebpackPlugin = require('html-webpack-plugin'); // tslint:disable-line: no-var-requires
const CopyPlugin = require('copy-webpack-plugin'); // tslint:disable-line: no-var-requires

const config: webpack.Configuration = {
    entry: {
        main: ['./src/index.tsx']
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                exclude: /node_modules/,
                loader: 'tslint-loader',
                options: {
                    emitErrors: true,
                    failOnHint: true
                },
                test: /\.tsx?$/

            },
            {
                loader:'file-loader',
                options: {
                    name: '?name=images/[name].[ext]',
                },
                test: /\.(jpe?g|png|gif|svg)$/i
            }
        ]
    },
    optimization: {
        splitChunks: {
            // cacheGroups: {
            //     defaultVendors: {
            //         test: /[\\/]node_modules[\\/]((?!(monaco-editor)|(@fluentui)).*)[\\/]/,
            //         name(module: any) { // tslint:disable-line:no-any
            //             console.log(module.context);
            //             const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            //             // npm package names are URL-safe, but some servers don't like @ symbols
            //             return `npm.${packageName.replace('@', '')}`;
            //         },
            //     },
            // },
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
        },
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: ''
    },
    plugins: [
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
        })
    ],
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.json'],
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            stream: false
        }
    },
};

export default config;
