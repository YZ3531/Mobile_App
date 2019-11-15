import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth' // 引入token操作工具函数

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: auth.getUser()
  },
  mutations: {
    // 存储用户token
    setUser (state, token) {
      state.user = token // 更改state数据
      auth.setUser(token) // 更改本地token
    },
    // 清除用户token
    delUser (state) {
      state.user = {} // 更改state数据
      auth.delUser() // 更改本地token
    }
  },
  actions: {
  },
  modules: {
  }
})
