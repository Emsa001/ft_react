import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import dotenv from "dotenv";
import webpack from "webpack";

dotenv.config();

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const envKeys = Object.keys(process.env)
    .filter((key) => key.startsWith("FT_REACT_PUBLIC_"))
    .reduce((env, key) => {
        env[`process.env.${key}`] = JSON.stringify(process.env[key]);
        return env;
    }, {});

export default {
    mode: "development",
    entry: "./react/index.ts",

    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.resolve(__dirname, "tsconfig.json"),
            }),
        ],
        modules: [
            path.resolve(__dirname, "react/types"),
            "node_modules",
        ],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [`style-loader`, "css-loader", "postcss-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            favicon: "./public/favicon.ico",
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: "public", to: "public" }],
        }),
        new webpack.DefinePlugin(envKeys),
    ],
    devServer: {
        static: {
            directory: path.join(path.dirname(new URL(import.meta.url).pathname), "dist"),
        },
        hot: true,
        liveReload: true,
        historyApiFallback: true,
        port: 3000,
    },
};
