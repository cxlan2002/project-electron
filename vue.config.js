const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    productionSourceMap: false,
    lintOnSave: false,

    pluginOptions: {
        electronBuilder: {
            customFileProtocol: "./",
            pluginOptions: {
                electronBuilder: {
                    builderOptions: {
                        nsis: {
                            allowToChangeInstallationDirectory: true,
                            oneClick: false,
                            installerIcon: './build/icon.ico', //安装logo
                            installerHeaderIcon: './build/icon.ico', //安装logo
                        },
                        electronDownload: {
                            mirror: 'https://npm.taobao.org/mirrors/electron/', //镜像设置
                        },
                        win: {
                            icon: './build/icon.ico', //打包windows版本的logo
                        },
                        productName: '新媒体营销实训系统', //应用的名称
                    },
                },
            },
        },
    },

    chainWebpack: (config) => {
        //移除预加载
        config.plugins.delete('prefetch');
        config.plugins.delete('preload');

        //压缩
        config.optimization.minimize(process.env.NODE_ENV !== 'development');

        //别名
        config.resolve.alias.set('@', resolve('src'));
    },

    configureWebpack: {
        plugins: [new NodePolyfillPlugin()],
        externals: {
            electron: 'require("electron")',
            fs: 'require("fs")',
            path: 'require("path")',
        },
    },

    css: {
        extract: process.env.NODE_ENV !== 'development',
        sourceMap: false,
        loaderOptions: {
            sass: {
                additionalData: `@import "@/assets/css/base.scss";`,
                sassOptions: {
                    outputStyle: 'expanded',
                },
            },
        },
    },
};
