<template>
  <div class="comment">
    <!-- 评论列表 -->
    <van-list
      @load="getComments"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :immediate-check="false"
    >
      <div
        class="item van-hairline--bottom van-hairline--top"
        v-for="item in comments"
        :key="item.com_id.toString()"
      >
        <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
        <div class="info">
          <p>
            <span class="name">{{item.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{item.like_count}}</span>
            </span>
          </p>
          <p class="contentP">{{item.content}}</p>
          <p>
            <span class="time">{{item.pubdate|relTime}}</span>&nbsp;
            <van-tag plain @click="openReplyDailog(item.com_id.toString())">{{item.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 回复 -->
    <van-action-sheet @close="commentId=null" @load="getReply()" :immediate-check="false" v-model="showReply" class="reply_dailog" title="回复评论">
      <van-list v-model="reply.loading" :finished="reply.finished" finished-text="没有更多回复了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="item in reply.list" :key="item.com_id.toString()">
          <van-image
            round
            width="1rem"
            height="1rem"
            fit="fill"
            :src="item.aut_photo"
          />
          <div class="info">
            <p>
              <span>{{item.aut_name}}</span>
            </p>
            <p class="contentP">{{item.content}}</p>
            <p>
              <span class="time">{{item.pubdate|relTime}}</span>
            </p>
          </div>
        </div>
      </van-list>
    </van-action-sheet>
    <!-- 输入框 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" v-else slot="button" @click="submit()">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import { getCommentsOrReplys, commentOrReply } from '@/api/article'
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
      comments: [],
      // ---------------------评论回复数据
      // 记录当前点击评论的ID
      commentId: null,
      // 回复对话框
      showReply: false,
      reply: {
        loading: false,
        finished: false,
        offset: null,
        list: []
      }
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
    // 提交评论或者回复
    async submit () {
      try {
        // 判断是否输入内容
        if (!this.value) return false
        // 开启评论状态
        this.submiting = true
        if (this.commentId) {
        // 回复
          const data = await commentOrReply(this.commentId, this.value, this.$route.params.id)
          // 成功
          this.$toast.success('回复成功')
          // 添加到 回复列表 首个位置
          this.reply.list.unshift(data.new_obj)
          // 结束提交中状态
          this.submiting = false
          // 清空输入框
          this.value = ''
          // 给当前评论的回复数量+1
          const currComment = this.comments.find(item => item.com_id.toString() === this.commentId)
          currComment.reply_count++
        } else {
        // 评论
          const data = await commentOrReply(this.$route.params.id, this.value)
          // 成功
          this.$toast.success('评论成功')
          // 追加本条评论到评论列表
          this.comments.unshift(data.new_obj)
          // 结束提交中状态
          this.submiting = false
          // 清空输入框
          this.value = ''
        }
      } catch (e) {
        this.$toast.fail('操作失败')
        this.submiting = false
      }
    },
    // 获取回复列表数据
    async getReply () {
      // 获取
      const data = await getCommentsOrReplys({
        type: 'c',
        source: this.commentId,
        offset: this.reply.offset
      })
      // 追加数据
      this.reply.list.push(...data.results)
      // 关闭加载中状态
      this.reply.loading = false
      // 判断是否还有数据
      if (data.last_id > data.end_id) {
        // 如果本地最后一条数据id不是所有评论中最后一条数据id
        this.reply.offset = data.last_id // 取出这个id,下次获取数据以此为偏移量
      } else {
        this.reply.finished = true // 数据加载完毕
      }
    },
    // 显示回复列表
    openReplyDailog (comId) {
      // 重置数据
      this.reply.loading = true // 打开加载中状态
      this.reply.finished = false // 隐藏加载完毕提示信息
      this.reply.list = [] // 清空回复数据数组,为获取最新回复数据,需要每次打开都重新加载
      // 打开回复框
      this.showReply = true
      // 记录当前点击评论的ID
      this.commentId = comId
      // 获取数据
      this.getReply()
    },
    // 获取评论列表
    async getComments () {
      const data = await getCommentsOrReplys({
        type: 'a',
        source: this.$route.params.id,
        offset: this.offset
      })
      // 将获取到的评论数据追加到评论列表
      this.comments.push(...data.results)
      // 结束加载中状态
      this.loading = false
      // 判断是否还有数据
      if (data.last_id > data.end_id) {
        // 如果本地最后一条数据id不是所有评论中最后一条数据id
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
      .name {
        color: #069;
      }
      .zan {
        vertical-align: middle;
        padding-right: 2px;
      }
      .count {
        vertical-align: middle;
        font-size: 10px;
        color: #666;
      }
      .time {
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
// 回复框样式
.van-popup--bottom{
  &.van-popup--round{
    border-radius: 0;
  }
}
.reply_dailog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
.contentP{
  word-break:break-word
}
</style>
