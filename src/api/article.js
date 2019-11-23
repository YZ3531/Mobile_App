import request from '@/utils/request'

/** 获取-文章列表**/
export const getArticle = (channelId, timestamp) => {
  return request('/app/v1_1/articles', 'get', {
    channel_id: channelId,
    timestamp,
    with_top: 1
  })
}

/** 文章-不喜欢**/
export const disLick = (ID) => {
  return request('/app/v1_0/article/dislikes', 'post', {
    target: ID
  })
}

/** 文章-取消不喜欢**/
export const unDisLick = (ID) => {
  return request(`/app/v1_0/article/dislikes/${ID}`, 'delete')
}

/** 文章-点赞**/
export const likings = (ID) => {
  return request('/app/v1_0/article/likings', 'post', {
    target: ID
  })
}

/** 文章-取消点赞**/
export const unLikings = (ID) => {
  return request(`/app/v1_0/article/likings/${ID}`, 'delete')
}

/** 类型-举报**/
export const report = (ID, type) => {
  return request('/app/v1_0/article/reports', 'post', {
    target: ID,
    type
  })
}

/** 关键字-提供联想词条**/
export const suggest = (q) => {
  return request('/app/v1_0/suggestion', 'get', { q })
}

/** 搜索文章**/
export const searchArticle = ({ page = 1, perPage = 20, q }) => {
  return request('/app/v1_0/search', 'get', {
    per_page: perPage,
    page,
    q
  })
}

/** 获取文章详情**/
export const getArticleDetail = (articleID) => {
  return request(`/app/v1_0/articles/${articleID}`, 'get')
}

/** 获取文章 评论或回复 列表**/
export const getCommentsOrReplys = ({ type, source, offset, limit = 10 }) => {
  // type - a | c  评论列表 | 回复列表
  // source - 评论列表ID | 回复列表ID
  // offset - 偏移量，上次数据最后一条的ID
  // limit - 每次加载数据的条数，默认时10条
  return request('/app/v1_0/comments', 'get', { type, source, offset, limit })
}
