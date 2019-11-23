<template>
  <div class="comment">
    <!-- 评论列表 -->
    <van-list @load="getComments" v-model="loading" :finished="finished" finished-text="没有更多了" :immediate-check="false">
      <div class="item van-hairline--bottom van-hairline--top" v-for="item in comments" :key="item.com_id.toString()">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="item.aut_photo"
        />
        <div class="info">
          <p>
            <span class="name">{{item.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{item.like_count}}</span>
            </span>
          </p>
          <p>{{item.content}}</p>
          <p>
            <span class="time">{{item.pubdate|relTime}}</span>&nbsp;
            <van-tag plain>{{item.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 输入框 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import { getCommentsOrReplys } from '@/api/article'
export default {
  data () {
    return {
      // 提交中...
      submiting: false,
      // 输入框内容
      value: '',
      // ---------------------评论列表数据
      // 评论列表加载中
      loading: false,
      // 评论列表加载完成
      finished: false,
      // 偏移量
      offset: null,
      // 评论数据
      comments: []
      // ---------------------评论回复数据

    }
  },
  // 本组件是在Article组件中使用,这个组件被缓存了
  // 每次应在激活组件时去获取最新数据--activated钩子
  activated () {
    // 重置数据
    this.comments = []
    // 加载效果 加载完毕提示
    this.loading = true
    this.finished = false
    // 获取评论
    this.getComments()
  },
  methods: {
    async getComments () {
      const data = await getCommentsOrReplys({
        type: 'a',
        source: this.$route.params.id,
        offset: this.offset
      })
      this.comments.push(...data.results)
      // 结束加载中状态
      this.loading = false
      // 判断是否还有数据
      if (data.last_id > data.end_id) { // 如果本地最后一条数据id不是所有评论中最后一条数据id
        this.offset = data.last_id // 取出这个id,下次获取数据以此为偏移量
      } else {
        this.finished = true // 数据加载完毕
      }
    }
  }
}
</script>

<style  lang="less">
// 列表样式
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
// 输入框样式
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
</style>
