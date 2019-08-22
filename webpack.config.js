/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
const path = require( 'path');
const HtmlWebpackPlugin = require( 'html-webpack-plugin');
const DefinePlugin = require('webpack').DefinePlugin;
const MonacoPlugin = require('monaco-editor-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

let indexConfig = {
    entry: {
        bundle: "./src/index.tsx"
    },
    output: {
        filename: "[name].[hash].js",
        path: path.resolve(__dirname, 'dist'),
        publicPath: ""
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
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
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: "file-loader?name=images/[name].[ext]"
            },
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            {
                test: /\.(scss|css)$/,
                use: [
                    { loader: 'style-loader'},
                    { loader: 'css-loader', options: { sourceMap: true}},
                    { loader: 'sass-loader', options: {sourceMap: true}}]
            }
        ]
    },
    optimization: {
        minimizer: [new TerserPlugin()],
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/](!monaco-editor)[\\/]/,
                    name(module) {
                        const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
                        // npm package names are URL-safe, but some servers don't like @ symbols
                        return `npm.${packageName.replace('@', '')}`;
                    },
                },
            },
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
        },
    },

    devServer: {
        historyApiFallback: true,
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM",
        "react-jsonschema-form": "JSONSchemaForm",
    },

    plugins: [
        new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'src', 'index.html') }),
        //new BundleAnalyzerPlugin(),
        //This can be split out into two webpack configs each defining its own controller endpoint
        new DefinePlugin({
            _CONTROLLER_ENDPOINT: "'http://127.0.0.1:8081/'"
        }),
        new MonacoPlugin({
            languages: ["json"]
        })
    ]
};

exports.default = indexConfig;