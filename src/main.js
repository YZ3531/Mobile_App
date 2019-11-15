import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 修改rem基准值的js插件，需要在打包后使用
import 'amfe-flexible'

// vant配置
import Vant from 'vant'
import 'vant/lib/index.less'
// 引入style下的css样式
import '@/style/index.css'
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
