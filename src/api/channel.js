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
 *获取所有频道信息
 *
 * ***/
export const getAllChannels = () => {
  return request('/app/v1_0/channels', 'get')
}

/**
 *
 *删除频道
 *
 * ***/
export const delChannel = (channelID) => {
  // 根据登录情况做不同操作
  // 登录状态下发删除请求
  // 未登录状态下删除本地存储频道信息
  // 调用处使用了await，所以要返回一个promise对象
  return new Promise(async (resolve, reject) => {
    try {
      const { user } = store.state
      // 1. 登陆状态
      if (user.token) {
        const data = await request(`/app/v1_0/user/channels/${channelID}`, 'delete')
        resolve(data)
      } else {
        const channelList = JSON.parse(window.localStorage.getItem(CHANNEL_KEY)) // 取出本地数组
        const index = channelList.findIndex(item => item.id === channelID) // 找到传进来ID对应在本地数组中索引
        channelList.splice(index, 1) // 将指定索引频道从我的频道删除
        window.localStorage.setItem(CHANNEL_KEY, JSON.stringify(channelList)) // 存入本地
        resolve()
      }
    } catch (e) {
      reject(e)
    }
  })
}

/**
 *
 *添加频道
 *
 * ***/
export const addChannel = (orderChannels) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { user } = store.state
      // 1. 登陆状态
      if (user.token) { // 登录状态调用接口传过去修改过的数组
        await request('app/v1_0/user/channels', 'put', {
          channels: orderChannels
        })
        resolve()
      } else {
      // 未登录
        const channelList = JSON.parse(window.localStorage.getItem(CHANNEL_KEY)) // 取出本地数组
        const { id, name } = orderChannels[orderChannels.length - 1] // 取出传进来数组中最后一位
        channelList.push({ id, name }) // 添加到本地数组最后
        window.localStorage.setItem(CHANNEL_KEY, JSON.stringify(channelList)) // 存入本地
        resolve()
      }
    } catch (e) {
      reject(e)
    }
  })
}
