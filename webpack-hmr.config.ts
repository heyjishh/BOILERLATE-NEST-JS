import { RunScriptWebpackPlugin } from 'run-script-webpack-plugin';
import * as path from 'path';
import { HotModuleReplacementPlugin, WatchIgnorePlugin, Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

const config: Configuration = {
    entry: ['webpack/hot/poll?100', './src/main.ts'],
    target: 'node',
    mode: 'development',
    externals: [
        nodeExternals({
            allowlist: ['webpack/hot/poll?100'],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: './tsconfig.json',
            }),
        ],
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.js',
    },
    plugins: [
        new HotModuleReplacementPlugin(),
        new WatchIgnorePlugin({
            paths: [/\.js$/, /\.d\.ts$/],
        }),
        new RunScriptWebpackPlugin({
            name: 'main.js',
            autoRestart: true,
        }),
    ],
};

export default config;
