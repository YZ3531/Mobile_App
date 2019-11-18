import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import plugin from '@/utils/plugin'
import 'amfe-flexible'// 修改rem基准值的js插件，需要在打包后使用
import Vant, { Lazyload } from 'vant'// vant配置
import 'vant/lib/index.less'
import '@/style/index.css' // 引入style下的css样式
Vue.use(Vant)
Vue.use(Lazyload) // 使用vant提供的内置插件实现图片懒加载
Vue.use(plugin)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
