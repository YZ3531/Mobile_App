<template>
  <div class="container">
    <!-- tab项 -->
    <van-tabs swipeable v-model="activeIndex">
      <van-tab :key="channel.id" v-for="channel in myChannels" :title="channel.name">
        <div class="scroll-wrapper">
            <!-- 下拉刷新 -->
            <van-pull-refresh
              v-model="activeChannel.downLoading"
              @refresh="onRefresh"
              :success-text="refreshSuccessText"
            >
              <!-- 列表 : 绑定上拉加载事件,以及绑定 -->
              <van-list
                v-model="activeChannel.upLoading"
                :finished="activeChannel.finished"
                finished-text="没有更多了"
                @load="onLoad"
              >
                <van-cell v-for="article in activeChannel.articles" :key="article.art_id.toString()">
                  <!-- 内容 -->
                  <div class="article_item">
                    <h3 class="van-ellipsis">{{article.title}}</h3>
                    <!-- 三张图结构 -->
                    <div class="img_box" v-if="article.cover.type===3">
                      <van-image class="w33" fit="cover" :src="article.cover.images[0]" />
                      <van-image class="w33" fit="cover" :src="article.cover.images[1]" />
                      <van-image class="w33" fit="cover" :src="article.cover.images[2]" />
                    </div>
                    <!-- 一张图结构 -->
                    <div class="img_box" v-if="article.cover.type===1">
                      <van-image class="w100" fit="cover" :src="article.cover.images[0]" />
                    </div>
                    <div class="info_box">
                      <span>{{article.aut_name}}</span>
                      <span>{{article.comm_count}} 评论</span>
                      <span>{{article.pubdate}}</span>
                      <span class="close">
                        <van-icon name="cross"></van-icon>
                      </span>
                    </div>
                  </div>
                </van-cell>
              </van-list>
            </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
    <!-- 更多项 -->
    <span class="bar_btn" slot="nav-right">
      <van-icon name="wap-nav"></van-icon>
    </span>
  </div>
</template>

<script>
import { getMyChannels } from '@/api/channel'
import { getArticle } from '@/api/article'
export default {
  name: 'container-home',
  data () {
    return {
      //   isLoading: false, // 下拉刷新
      //   upLoading: false, // 上拉加载中
      //   finished: false, // 是否全部加载,为true触发文字提示
      //   articles: [], // 文章列表
      myChannels: [], // 我的频道数据
      activeIndex: 0, // 当前激活的频道索引
      refreshSuccessText: '' // 刷新成功提示信息
    }
  },
  created () {
    this.getMyChannels() // 获取频道数据
  },
  computed: {
    // 通过激活的频道ID
    activeChannel () {
      return this.myChannels[this.activeIndex]
    }
  },
  methods: {
    // 加载
    async onLoad () {
      // @load特点 : 默认在组件初始化会加载一次
      // @load特点 : 当加载的内容渲染后不足铺满屏幕,继续触发一次
      // @load事件触发条件 : 向上滑动到底部触发
      // 业务 : 获取列表数据进行渲染,先进行模拟
      //   window.setTimeout(() => {
      //     this.upLoading = false // 数据加载成功,结束加载动画
      //     const data = [] // 模拟数据
      //     for (let i = this.articles.length; i < this.articles.length + 10; i++) {
      //       data.push(i + 1) // 每加载一次,往后生成十条数据
      //     }
      //     this.articles.push(...data) // 追加到数据中
      //     if (this.articles.length >= 50) {
      //       this.finished = true // 判断总条数达到50条,显示已经加载全部
      //     }
      //   }, 1000) // 延时执行加载事件
      const data = await getArticle(
        this.activeChannel.id,
        this.activeChannel.timestamp
      )
      this.activeChannel.upLoading = false
      this.activeChannel.articles.push(...data.results) // 向当前显示的频道对应的列表后追加新获取的数据
      if (!data.pre_timestamp) {
        // pre_timestamp : 请求前一页历史数据的时间戳
        this.activeChannel.finished = true // 数据没有了，即加载完毕，将finished属性改为true
      } else {
        this.activeChannel.timestamp = data.pre_timestamp // 记录下响应体的时间戳，下次加载时携带上
      }
    },
    // 刷新
    async onRefresh () {
      //   window.setTimeout(() => {
      //     // 模拟网络耗时
      //     this.isLoading = false // 数据请求成功，结束正在刷新的效果
      //     const arr = [1, 2, 3, 4, 5, 6] // 模拟响应数据
      //     if (arr.length) {
      //       // 如果相应回来有数据
      //       this.articles = arr // 将回来的数据给文章列表
      //       this.refreshSuccessText = '刷新成功' // 给出刷新成功提示信息
      //       this.onLoad() // 回来的数据可能不够占满屏幕，调用一次上拉加载
      //       this.finished = false // 重置加载全部数据是否加载完毕
      //     } else {
      //       this.refreshSuccessText = '暂无更新' // 给刷新后没有获取到数据的提示
      //     }
      //   }, 1000)
      this.activeChannel.timestamp = Date.now() // 获取当前时间戳赋值给timestamp，并在获取文章列表时带上
      const data = await getArticle(
        this.activeChannel.id,
        this.activeChannel.timestamp
      )
      this.activeChannel.downLoading = false
      if (data.results.length) {
        // 如果返回体有数据
        this.activeChannel.articles = data.results
        this.refreshSuccessText = '刷新成功' // 提示信息
        this.activeChannel.finished = false // 状态 ： 没有加载完毕
        this.activeChannel.timestamp = data.pre_timestamp // 将返回的时间戳设置给自己
        this.onLoad() // 防止数据没有占满屏幕，先调用一次
      } else {
        this.refreshSuccessText = '暂无数据' // 提示错误信息
      }
    },
    // 获取我的频道信息
    async getMyChannels () {
      const data = await getMyChannels()
      // this.myChannels = data.channels // 渲染频道（标签页，tabs组件）
      // myChannels数组中每一项中包含频道ID&频道名称
      // 但是需要myChannels数组中每一项中包含更多的信息
      // 例如 : 文章列表 + 正在加载 + 正在刷新 + 是否全部加载 + 时间戳
      this.myChannels = data.channels.map(item => {
        return {
          id: item.id, // 频道id
          name: item.name, // 频道名字
          articles: [], // 频道对应文章列表
          upLoading: false, // 加载中
          downLoading: false, // 刷新中
          finished: false, // 是否已经全部加载了，没有数据了
          timestamp: Date.now() // 相当于分页的页码
        }
      })
    }
  }

}
</script>

<style lang="less">
// tabs栏样式
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
// 内容样式
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
