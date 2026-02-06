/***********************************************************
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License
 **********************************************************/
import * as path from 'path';

const config = {
    mode: 'production',
    target: 'electron-preload',
    entry: './public/contextBridge.ts',
    output: {
        path: path.resolve(__dirname, 'host'),
        filename: 'contextBridge.js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve(__dirname, 'public/tsconfig.json')
                    }
                }
            },
        ]
    },
    node: {
        __dirname: false,
        __filename: false
    },
    externals: {
        electron: 'commonjs electron'
    }
};

export default config;
