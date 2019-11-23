import axios from 'axios'
import JSONBIGINT from 'json-bigint'
import store from '@/store'
import router from '@/router'

// 创建一个axios实例
const instance = axios.create({
  // 设置基准地址
  baseURL: 'http://ttapi.research.itcast.cn/',
  // 处理JS最大安全数值
  transformResponse: [(data) => {
    try {
      return JSONBIGINT.parse(data)
    } catch (e) {
      return data
    }
  }]
})

// 给instance设置请求拦截器
instance.interceptors.request.use(config => {
  // 拦截到了，判断token的存在
  if (store.state.user.token) {
    // --给请求头带上token
    config.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return config
  // --错误返回一个错误的promise对象
}, err => Promise.reject(err))

// 给instance设置响应拦截器 ---TODO->token的延长有效期
instance.interceptors.response.use(res => {
  try {
    // --对响应体进行分析，剥离有用数据
    return res.data.data
  } catch (err) {
    // -- 没有就返回原响应体，避免报错
    return res
  }
}, async err => {
  // 如果请求失败走这个函数
  // 1. 判断是否是 401 状态码
  // 2. 如果是  判断是不是登录
  // 2.1  如果没登录  拦截到登录页面（登录完了需要回跳）
  // 2.2  已经登录了  token失效
  // 3. 发刷新token的请求
  // 3.1 刷新成功  更新vuex和本地token
  // 3.2 把之前失败的请求继续发送出去
  // 3.3 刷新失败  拦截到登录页面（登录完了需要回跳）

  // 判断状态是否是401,是否有响应体
  if (err.response && err.response.status === 401) {
    // 获取当前路径地址,做登录之后的回跳处理
    const loginConfig = { path: '/login',
      query: {
        redirectURL: router.currentRoute.path
      } }
    // 获取vuex中用户状态信息
    const user = store.state.user
    // 没登录
    if (!user || !user.token || !user.refresh_token) {
      // 强制去登录,并做了回跳处理
      router.push(loginConfig)
      return Promise.reject(err) // 让函数接收一个错误的promise,能够阻止一些错误了的程序还会运行的bug
    }
    // token失效
    try {
      // 发送刷新token请求
      const { data: { data } } = await axios({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'put',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 更新vuex数据与本地数据
      store.commit('setUser', { token: data.token, refresh_token: user.refresh_token })
      // 重新发送之前失败的请求--请求失败的请求配置参数 err.config
      return instance(err.config) // 注意 : 一定要return一个promise对象
    } catch (e) {
      // refresh_token也失效
      store.commit('delUser')
      // 强制去登录,并做了回跳处理
      router.push(loginConfig)
      return Promise.reject(err)
    }
  }
  return Promise.reject(err)
})

// 对axios的封装&导出
export default (url, method, data) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: data
  })
}
