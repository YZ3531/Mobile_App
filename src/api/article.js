import request from '@/utils/request'

/** 获取文章列表**/
export const getArticle = (channelId, timestamp) => {
  return request('/app/v1_1/articles', 'get', {
    channel_id: channelId,
    timestamp,
    with_top: 1
  })
}

/** 不喜欢**/
export const disLick = (ID) => {
  return request('/app/v1_0/article/dislikes', 'post', {
    target: ID
  })
}

/** 根据类型举报**/
export const report = (ID, type) => {
  return request('/app/v1_0/article/reports', 'post', {
    target: ID,
    type
  })
}
