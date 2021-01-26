// vue.config.js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://apis.map.qq.com',
        pathRewrite: {
          '^/api': ''
        }
      }
    },
  }
}
