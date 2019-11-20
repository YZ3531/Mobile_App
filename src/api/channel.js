import request from '@/utils/request'
import store from '@/store'// 重构所需--实现，登陆获取后台频道信息，未登录获取本地频道信息（修改频道操作得以保存）
const CHANNEL_KEY = 'hm-toutiao-channel'// 存储 我的频道信息 所用
/**
 *
 *获取我的频道信息（如果未登陆，获取的是后台设置的默认频道列表）
 *
 * ***/
export const getMyChannels = () => {
  // 调用处使用了await，所以要返回一个promise对象
  return new Promise(async (resolve, reject) => {
    const { user } = store.state
    // 1. 登陆状态
    if (user.token) {
      const data = await request('/app/v1_0/user/channels', 'get') // 获取
      resolve(data) // 返回
    } else {
    // 2. 未登陆状态
      const localChannels = JSON.parse(window.localStorage.getItem(CHANNEL_KEY) || '[]')// 取出本地存储的频道数据，取不到就给一个空数组
      if (!localChannels.length) { // 1）本地没存（去获取，并存本地）
        const data = await request('/app/v1_0/user/channels', 'get') // 获取
        window.localStorage.setItem(CHANNEL_KEY, JSON.stringify(data.channels)) // 存入
        resolve(data) // 返回
      } else { // 2）本地存有（获取本地数据进行渲染）
        resolve({ channels: localChannels })
      }
    }
  })
}

/**
 *
 *获取我的频道信息（如果未登陆，获取的是后台设置的默认频道列表）
 *
 * ***/
export const getAllChannels = () => {
  return request('/app/v1_0/channels', 'get')
}
