const path = require("path");
const webpack = require("webpack");
const WebpackNotifierPlugin = require("webpack-notifier");
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css', 'json'];
const tsImportPluginFactory = require('ts-import-plugin');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    lintOnSave: true,
    publicPath: "./",
    transpileDependencies: [
        /authox-vue/gi,
        /vue-ol/gi,
        'vue-echarts',
        'resize-detector',
        /iview.src.(?!utils.date\.js\b).+$/
    ],
    chainWebpack: config => {
        // config.resolve.alias.set("@suc/ui", resolve("src/components/sucsoft"));
    },
    css: {
        loaderOptions: {
            postcss: {
                plugins: [
                    require('autoprefixer')(),
                ]
            }
        }
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
                minSize: 1000,
                minChunks: 1,
                maxAsyncRequests: 10,
                maxInitialRequests: 5,
                automaticNameDelimiter: '~',
                name: true,
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                    },
                    default: {
                        minChunks: 1,
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
            // new BundleAnalyzerPlugin({
            //     analyzerPort: 6543
            // })
        ],
        module: {
            rules: [
                {
                    test: /\.txt/i,
                    use: 'raw-loader'
                }
            ]
        }
    },
};
