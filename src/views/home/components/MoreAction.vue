<template>
  <van-popup :value="value" @input="$emit('input',$event)" @open="isReport=false">
    <van-cell-group v-if="!isReport">
      <van-cell @click="disLick()">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell>拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell
        @click="report(item.value)"
        v-for="item in reportType"
        :key="item.value"
      >{{item.label}}</van-cell>
    </van-cell-group>
  </van-popup>
</template>

<script>
import { disLick, report } from '@/api/article'
import { reportType } from '@/api/constants'
export default {
  name: 'more-action',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    articleID: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      isReport: false,
      reportType
    }
  },
  methods: {
    async report (type) { // 举报
      // 执行
      // 提示
      // 关闭对话框
      // 通知父组件删除
      try {
        await report(this.articleID, type)
        this.$toast({ type: 'success', message: '举报成功' }) // 提示信息
        this.$emit('input', false)
        this.$emit('on-report', this.articleID)
      } catch (e) {
        if (e.respones && e.respones.stutas === 409) {
          return this.$toast({ type: 'fail', message: '重复举报' })
        } else {
          this.$toast({ type: 'fail', message: '举报失败' })
        }
      }
    },
    async disLick () {
      // 不喜欢 请求
      try {
        await disLick(this.articleID) // 请求
        this.$toast({ type: 'success', message: '操作成功' }) // 提示信息
        this.$emit('input', false) // 关闭对话
        this.$emit('on-success', this.articleID) // 传递给父组件ID，表示确定对此ID文章进行操作了
      } catch (e) {
        this.$toast({ type: 'fail', message: '操作失败' })
      }
    }
  }
}
</script>

<style scoped>
.van-popup {
  width: 80%;
  border-radius: 4px;
}
</style>
