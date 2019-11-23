<template>
  <div class="container-search">
    <van-nav-bar title="搜索中心" left-text left-arrow @click-left="$router.back()" />
    <!-- 搜索框 -->
    <van-search v-model.trim="q" placeholder="请输入搜索关键词" shape="round" @search="onSearch(q)" />
    <!-- 联想搜索词条 -->
    <van-cell-group class="suggest-box" v-if="q">
      <!-- 词条点击需要跳转搜索结果页面,需要事件,需要传值,onSearch正好满足条件,无需多写方法 ,注意参数是包裹span标签的-->
      <van-cell icon="search" v-for="item in opctions" :key="item" @click="onSearch(item.replace(`<span>${q}</span>`,q))">
        <p v-html="item">
          <!-- <span>j</span>ava -->
        </p>
      </van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <div class="history-box" v-else-if="historyList.length">
      <div class="head">
        <span>历史记录</span>
        <van-icon name="delete" @click="clearHistory"></van-icon>
      </div>
      <van-cell-group>
        <!-- 遍历本地搜索历史记录 -->
        <van-cell v-for="key in historyList" :key="key">
          <a class="word_btn" @click="toSearch(key)">{{key}}</a>
          <van-icon class="close_btn" slot="right-icon" name="cross" @click="delHistory(key)"/>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { suggest } from '@/api/article'
const KEY = 'hm-toutiao-historyKEY' // 约定好去本地存储中取 搜索记录 的键
export default {
  data () {
    return {
      // 搜索关键字
      q: '',
      // 取出本地历史记录列表
      historyList: JSON.parse(window.localStorage.getItem(KEY) || '[]'),
      // 联想建议词条
      opctions: [],
      // 计时器
      timer: null
    }
  },
  methods: {
    // 触发搜索-去搜索结果页面
    onSearch (key) {
      // 触发联想
      // 存入本地历史记录
      // 跳转搜索结果页
      if (!key.trim().length) return false // 如果没输入内容,直接返回
      const set = new Set(this.historyList) // 使用set实现历史记录不重复
      set.add(key) // 将本次搜索字段添加到历史记录
      this.historyList = [...set] // 再将set转为数组,赋值给历史记录数组
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList)) // 注意 : 保存到本地
      this.$router.push({ path: '/search/result', query: { key } }) // 跳转搜索结果页面
    },
    // 根据历史记录去搜索结果
    toSearch (key) {
      // 携带历史记录关键字跳转到搜索结果页面
      this.$router.push({ path: '/search/result', query: { key } })
    },
    // 删除历史记录
    delHistory (key) {
      // 取索引
      const index = this.historyList.findIndex(item => {
        return key === item
      })
      // 删除数据
      this.historyList.splice(index, 1)
      // 存入本地
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
    },
    // 清空历史记录
    clearHistory () {
      // 数据清空
      this.historyList = []
      // 本地清空
      window.localStorage.setItem(KEY, JSON.stringify(this.historyList))
    }
  },
  watch: {
    q () { // 注意 : 函数防抖
      // 如果没有输入,就不去发送请求了
      if (!this.q) return window.clearTimeout(this.timer)

      // 优化,发送请求不是在改变即发送,需要点时间间隔
      // 1. 输入内容后,等待一段时间,没有改变内容,发送请求
      // 2. 输入内容后,等待过程中,改变了内容,重新计时
      window.clearTimeout(this.timer) // 如果上一个定时器还未执行完,则清除定时器,从新定时
      this.timer = window.setTimeout(async () => {
        // 调用API发送请求获取建议词条
        const data = await suggest(this.q)
        // 取出响应体中的词条数组
        this.opctions = data.options.map(item => {
          // 遍历将每条词条中包含搜索关键字的部分替换成红色字体,最后返回一个新数组
          return item.toLowerCase().replace(this.q, `<span>${this.q}</span>`)
          // 后台可能不区分大小写,进行一下转换即可
        })
      }, 1000)
    }
  }
}
</script>

<style lang='less' >
.history-box {
  padding: 0 20px;
  .head {
    line-height: 36px;
    color: #999;
    .van-icon {
      font-size: 16px;
      float: right;
      margin-top: 10px;
    }
  }
  .van-cell {
    padding: 10px 0;
  }
  .word_btn {
    color: #3296fa;
  }
  .close_btn {
    margin-top: 5px;
    color: #999;
  }
}
// 联想
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>
