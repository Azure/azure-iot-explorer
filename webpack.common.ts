import * as webpack from 'webpack';
import * as path from 'path';
const HtmlWebpackPlugin = require('html-webpack-plugin'); // tslint:disable-line: no-var-requires
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin'); // tslint:disable-line: no-var-requires
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // tslint:disable-line: no-var-requires

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
                loader: 'file-loader?name=images/[name].[ext]',
                test: /\.(jpe?g|png|gif|svg)$/i
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]((?!(monaco-editor)|(office-ui-fabric-core)).*)[\\/]/,
                    name(module: any) { // tslint:disable-line:no-any
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
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, '.', 'dist'),
        publicPath: ''
    },
    plugins: [
        new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '.', 'src', 'index.html')
        }),
        // new BundleAnalyzerPlugin(),
        new MonacoWebpackPlugin({
            features: [
                'accessibilityHelp',
                'bracketMatching',
                'caretOperations',
                'clipboard',
                // 'codeAction',
                'codelens',
                'comment',
                'contextmenu',
                'coreCommands',
                'cursorUndo',
                'dnd',
                'find',
                'folding',
                'fontZoom',
                'format',
                'gotoError',
                'gotoLine',
                'hover',
                'inPlaceReplace',
                // 'inspectTokens',
                // 'iPadShowKeyboard',
                'linesOperations',
                'links',
                // 'parameterHints',
                'rename',
                'smartSelect',
                'suggest',
                'toggleHighContrast',
                'toggleTabFocusMode',
                'transpose',
                'wordHighlighter',
                'wordOperations',
                'wordPartOperations'
            ],
            languages: ['json']
        })
    ],
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
};

export default config;
