const path = require("path");
const webpack = require("webpack");
const WebpackNotifierPlugin = require("webpack-notifier");
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css', 'json'];

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    lintOnSave: true,
    transpileDependencies: [
        "@suc/authox/plugins/authox-vue",
        /vue-ol/gi,
        'vue-echarts',
        'resize-detector'
    ],
    chainWebpack: config => {
        config.resolve.alias.set("@", resolve("src"));
    },
    devServer: {
        proxy: {
            "/api/": {
                target: "http://localhost:8098",
                changeOrigin: true,
                pathRewrite: {
                    "^/api": ""
                }
            }
        }
    },
    configureWebpack: {
        // devtool: false,
        optimization: {
            splitChunks: {
                chunks: 'async',
                minSize: 30000,
                maxSize: 0,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                automaticNameDelimiter: '~',
                name: true,
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                    dll: {
                        test: /[\\/]node_modules[\\/](vue|vue-router|vuex|iview)[\\/]/,
                        name: 'dll',
                        chunks: 'all',
                    },
                },
            },
        },
        plugins: [
            new CompressionWebpackPlugin({
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                deleteOriginalAssets: false
            }),
            new WebpackNotifierPlugin({alwaysNotify: true}),
            new BundleAnalyzerPlugin({
                analyzerPort: 6543
            })
        ]
    },
};
