// vue.config.js
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  chainWebpack: config => {
    //设置别名
    config.resolve.alias.set("@", resolve("src"));
  },
  publicPath:
    process.env.NODE_ENV === "production" ? "/\n" + "vue-cesium-example/" : "/",
  configureWebpack: {
    // resolve: {
    //   alias: {
    //     "@": resolve("src")
    //   }
    // },
    plugins: [
      // Copy Cesium Assets, Widgets, and Workers to a static directory
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "node_modules/cesium/Build/Cesium/Workers",
            to: "cesium/Workers"
          },
          {
            from: "node_modules/cesium/Build/Cesium/ThirdParty",
            to: "cesium/ThirdParty"
          },
          {
            from: "node_modules/cesium/Build/Cesium/Assets",
            to: "cesium/Assets"
          },
          {
            from: "node_modules/cesium/Build/Cesium/Widgets",
            to: "cesium/Widgets"
          }
        ]
      }),
      new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify("./cesium")
      })
    ],
    module: {
      // Removes these errors: "Critical dependency: require function is used in a way in which dependencies cannot be statically extracted"
      // https://github.com/AnalyticalGraphicsInc/cesium-webpack-example/issues/6
      unknownContextCritical: false,
      unknownContextRegExp: /\/cesium\/cesium\/Source\/Core\/buildModuleUrl\.js/
    }
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [require("tailwindcss"), require("autoprefixer")]
      }
    }
  },
  //devServer.proxy适用于本地开发使用，
  //生成环境请用第三方代理软件，如nginx。
  devServer: {
    port: 28080, //本机端口号
    // host: "10.1.6.38", //本机主机名
    https: false, //协议
    // open: true, //启动服务器时自动打开浏览器访问
    proxy: {
      "/models": {
        //目标服务器,代理访问到http://localhost:8888
        target: "http://localhost:5000",
        changOrigin: true, //开启代理
        pathRewrite: {
          "^/models": ""
        }
      },
      "/api": {
        //目标服务器,代理访问到http://localhost:8888
        target: "http://10.1.6.72:8888",
        changOrigin: true //开启代理
        // pathRewrite: {
        //   "^/models": ""
        // }
      }
    }
  }
};
