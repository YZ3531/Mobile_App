module.exports = {
  plugins: {
    autoprefixer: {},
    // rem适配，基准值37.5px/1rem
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
}
