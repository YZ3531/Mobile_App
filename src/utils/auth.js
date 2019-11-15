const USER_KEY = 'hm-toutiao-m'

export const getUser = () => {
  // 返回数据为JSON字符串，要将其转化为JS数据，并有可能取不到token（返回空对象）
  return JSON.parse(window.localStorage.getItem(USER_KEY) || '{}')
}
export const setUser = (token) => {
  // 设置token，本地数据的存取都是JSON格式，要进行提前转换
  window.localStorage.setItem(USER_KEY, JSON.stringify(token))
}
export const delUser = () => {
  // 删除token，直接删除即可
  window.localStorage.removeItem(USER_KEY)
}
