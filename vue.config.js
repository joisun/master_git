const { defineConfig } = require("@vue/cli-service");
const packageName = require("./package.json").name;
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  runtimeCompiler: true,
  devServer: {
    proxy: {
      '^/': {  // Key: A path prefix to trigger the proxy
        // target: 'http://simboss-whitehouse-feature-sale-commission-240130.test.simboss.com', // Target of the proxy (your API server)
        target: 'http://localhost:9999', // Target of the proxy (your API server)
        changeOrigin: false,             // Modifies the origin header in requests
        // pathRewrite: { '^/api': '' }    // Remove the '/api' prefix
      },
      '^/international': {  // Key: A path prefix to trigger the proxy
        // target: 'http://simboss-whitehouse-feature-sale-commission-240130.test.simboss.com', // Target of the proxy (your API server)
        target: 'http://simboss-avatar-lady-liberty-feature-once.test.simboss.com', // Target of the proxy (your API server)
        changeOrigin: true,             // Modifies the origin header in requests
        pathRewrite: { '^/international': '' }    // Remove the '/api' prefix
      }
    },
    port: 8090,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
    },
  },
  publicPath: "/client/",
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin()
    ],
    output: {
      library: `${packageName}-[name]`,
      libraryTarget: "umd",
    },
  },
});
