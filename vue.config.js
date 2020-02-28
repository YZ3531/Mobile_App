// 配置文件 - vue-cli配置对象
module.exports = {
  // 配置构建完毕的代码访问方式
  // 如 / 则必须通过服务器方式访问,就是默认值
  publicPath: './',
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          blue: '#3296FA'
        }
      }
    }
  }
}
