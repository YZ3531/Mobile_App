import request from '@/utils/request'

// 登录
export const login = (data) => request('/app/v1_0/authorizations', 'post', data)
