const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
// 导入compression-webpack-plugin
const CompressionWebpackPlugin = require('compression-webpack-plugin');
// 定义压缩文件类型
const productionGzipExtensions = ['js', 'css'];
const env = process.env.npm_lifecycle_event;
// vue.config.js文件
const path = require("path");
let dllPublishPath = '/vendor';

function resolve(dir) {
  return path.join(__dirname, dir);
}
const debug = process.env.NODE_ENV !== "production";

module.exports = {
  publicPath: "/", // 基本路径
  outputDir: "dist", // 输出文件目录
  lintOnSave: false, // eslint-loader 是否在保存的时候检查
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  filenameHashing: true, //计算hash
  runtimeCompiler: true,
  // dev: {
  //   proxyTable: {
  //     "/api": {
  //       target: "", //真实的路径
  //       changeOrigin: true, //允许跨域
  //       pathRewrite: {
  //         //路径替换
  //         "^/api": "/"
  //       }
  //     }
  //   }
  // },
  pages: {
    index: {
      // entry for the page
      entry: "src/main.js",
      // the source template
      template: "public/index.html",
      // output as dist/index.html
      filename: "index.html"
      // 提取出来的通用 chunk 和 vendor chunk。
      // chunks: ["chunk-vendors", "chunk-common", "index"],
      // 排序顺序
      // chunksSortMode: "manual"
    }
  },
  devServer: {
    // 禁止host检查
    disableHostCheck: true,
    https: process.env.HTTPS === "true"
  },
  //链式操作
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@c", resolve("src/components"))
      .set("assets", resolve("src/assets"));
    config.output.filename("[name].[hash].js").end();
  },
  configureWebpack: config => {
    // 生产环境
    console.log(
      "\n运行环境：",
      process.env.NODE_ENV,
      "\n服务端API：",
      process.env.VUE_APP_SERVICE_URL
    );
    //webpack输出process.env
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env": process.env
      }),
      new webpack.DllReferencePlugin({
        context: process.cwd(),
        manifest: require('./public/vendor/vendor-manifest.json')
      }),
      // 将 dll 注入到 生成的 html 模板中
      new AddAssetHtmlPlugin({
        // dll文件位置
        filepath: path.resolve(__dirname, './public/vendor/*.js'),
        // dll 引用路径
        publicPath: dllPublishPath,
        // dll最终输出的目录
        outputPath: './vendor'
      }),
      // 开启压缩
      new CompressionWebpackPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
          '\\.(' + productionGzipExtensions.join('|') + ')$'
        ),
        threshold: 10240,
        minRatio: 0.8
      })
    );
    //webpack-bundle-analyzer
    //改成对应的环境可查看包的大小
    if (process.env.VUE_APP_SERVER_TYPE == -10) {
      config
        .plugin("webpack-bundle-analyzer")
        .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
    }
    // if (process.env.npm_lifecycle_event === 'analyze') {
    //   config.plugins.push(new BundleAnalyzerPlugin())
    // }
  },
  pluginOptions: {}
};