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
