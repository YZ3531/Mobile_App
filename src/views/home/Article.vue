<template>
  <div class="container" @scroll="remember($event)" ref="articleContent">
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <!-- 文章名称 -->
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <!-- 作者名字 -->
          <p class="name">{{article.aut_name}}</p>
          <!-- 日期 -->
          <p class="time">{{article.pubdate|relTime}}</p>
        </div>
        <!-- 是否已经关注 -->
        <van-button
          round
          size="small"
          type="info"
          @click="followed"
        >{{article.is_followed?"已关注":"+ 关注"}}</van-button>
      </div>
      <!-- 文章内容 -->
      <div class="content" v-html="article.content"></div>
      <div class="zan">
        <van-button
          round
          size="small"
          :class="{active:article.attitude===1}"
          @click="updateStatus(1)"
          plain
          icon="like-o"
        >点赞</van-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <van-button
          round
          size="small"
          :class="{active:article.attitude===0}"
          @click="updateStatus(0)"
          plain
          icon="delete"
        >不喜欢</van-button>
      </div>
    <!-- 评论与回复组件 -->
    <comment></comment>
    </div>
  </div>
</template>

<script>
// 评论组件
import Comment from './components/Comment'
// 获取文章详情,不喜欢,取消不喜欢,点赞,取消点赞
import {
  getArticleDetail,
  disLick,
  unDisLick,
  likings,
  unLikings
} from '@/api/article'
import { followed, unFollowed } from '@/api/user'
export default {
  name: 'articleContent',
  data () {
    return {
      // 文章详情
      article: {
        art_id: ''
        // 记录阅读位置
      },
      scrollTop: 0
    }
  },
  // 当前文章详情组件已被缓存,内容展示不该写在created(因为只会执行一次),应使用actived(组件被激活时)
  // 需求 : 如果激活组件时,本次查看文章与上次查看文章ID一致时,不需重新加载
  activated () {
    if (this.$route.params.id !== this.article.art_id.toString()) {
      this.getArticle()
      this.scrollTop = 0
    } else {
      this.$refs['articleContent'].scrollTop = this.scrollTop
    }
  },
  methods: {
    // 不喜欢 , 取消不喜欢 , 点赞 , 取消点赞
    async updateStatus (type) {
      try {
        // type - 1 代表点赞按钮 - 0 代表不喜欢按钮
        if (type) {
          // 点赞 或 取消点赞
          if (this.article.attitude === 1) {
            // 取消点赞
            await unLikings(this.article.art_id)
            // 修改状态
            this.article.attitude = -1
          } else {
            // 点赞
            await likings(this.article.art_id)
            this.article.attitude = 1
          }
        } else {
          // 不喜欢 或 取消不喜欢
          if (this.article.attitude === 0) {
            // 取消不喜欢
            await unDisLick(this.article.art_id)
            this.article.attitude = -1
          } else {
            // 不喜欢
            await disLick(this.article.art_id)
            this.article.attitude = 0
          }
        }
        // 提示
        this.$toast.success('操作成功')
      } catch (e) {
        if (e.response.status !== 401) {
          // 表示不是因为未登录的原因
          this.$toast.fail('操作失败')
        }
      }
    },
    // 获取文章详情
    async getArticle () {
      const data = await getArticleDetail(this.$route.params.id)
      this.article = data
    },
    // 记录阅读位置
    remember (e) {
      this.scrollTop = e.target.scrollTop
    },
    // 切换 加关注&已关注
    async followed () {
      try {
        if (this.article.is_followed) {
          // 已关注
          await unFollowed(this.article.aut_id)
          this.$toast.success('取消关注成功')
          this.article.is_followed = false
        } else {
          // 未关注
          await followed(this.article.aut_id)
          this.$toast.success('添加关注成功')
          this.article.is_followed = true
        }
      } catch (e) {
        if (e.response.status !== 401) {
          // 表示不是因为未登录的原因
          this.$toast.fail('操作失败')
        }
      }
    }
  },
  components: {
    Comment // 挂载评论组件
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  // height: 1000%;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan {
    text-align: center;
    padding: 10px 0;
    .active {
      border-color: red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  // 作用于文章具体内容(包含html结构)
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
    /deep/ code {
      white-space: pre-wrap;
    }
  }
}
</style>
