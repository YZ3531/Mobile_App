import request from '@/utils/request'

// 登录
export const login = (data) => request('/app/v1_0/authorizations', 'post', data)

// 关注用户
export const followed = (userID) => {
  return request('/app/v1_0/user/followings', 'post', { target: userID })
}

// 取消关注
export const unFollowed = (userID) => {
  return request(`/app/v1_0/user/followings/${userID}`, 'delete')
}

// 获取用户个人信息
export const getUserInfo = () => {
  return request('app/v1_0/user', 'get')
}

// 获取个人中心编辑用户资料信息
export const getUserProfile = () => {
  return request(`/app/v1_0/user/profile`, 'get')
}

// 保存个人头像-修改
export const saveUserPhoto = (formData) => {
  return request('/app/v1_0/user/photo', 'patch', formData)
}

// 保存个人信息-修改
export const saveUserInfo = (name, gender, birthday) => {
  return request('/app/v1_0/user/profile', 'patch', { name, gender, birthday })
}
