const WebpackNotifierPlugin = require("webpack-notifier");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = ["js", "css", "json"];

module.exports = {
    lintOnSave: false,
    productionSourceMap: false,
    transpileDependencies: [
        /authox-vue/gi,
        /monch/gi,
        "vue-echarts",
        /iview.src.(?!utils.date\.js\b).+js$/,
        "vuex-module-decorators"
    ],
    css: {
        loaderOptions: {
            scss: {
                prependData: `@import "~@/styles/modules/variables.scss";`
            }
        }
    },
    chainWebpack: config => {
        config.plugin("html").tap(args => {
            args[0].title = "GNet2020";
            return args;
        });
    },
    configureWebpack: {
        // devtool: false,
        optimization: {
            splitChunks: {
                chunks: "async",
                minSize: 1000,
                minChunks: 1,
                maxAsyncRequests: 10,
                maxInitialRequests: 5,
                automaticNameDelimiter: "~",
                name: true,
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10
                    },
                    default: {
                        minChunks: 1,
                        priority: -20,
                        reuseExistingChunk: true
                    },
                    dll: {
                        test: /[\\/]node_modules[\\/](vue|vue-router|vuex|iview)[\\/]/,
                        name: "dll",
                        chunks: "all"
                    }
                }
            }
        },
        plugins: [
            new CompressionWebpackPlugin({
                test: new RegExp(
                    "\\.(" + productionGzipExtensions.join("|") + ")$"
                ),
                threshold: 10240,
                deleteOriginalAssets: false
            }),
            new WebpackNotifierPlugin({ alwaysNotify: true }),
            new BundleAnalyzerPlugin({
                analyzerPort: 6544
            })
        ]
    },
    devServer: {
        proxy: {
            "/api/": {
                target: "http://172.18.45.13:8060/",
                changeOrigin: true,
                pathRewrite: {
                    "^/api": ""
                }
            }
        },
        watchOptions: {
            ignored: "/node_modules/",
            poll: 1200
        }
    }
};
