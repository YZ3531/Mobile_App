<template>
  <div class="container">
    <!-- tab项 -->
    <van-tabs swipeable>
      <van-tab :key="index" v-for="index in 8" :title="'标签 ' + index">
        <div class="scroll-wrapper">
          <!-- 单元格 -->
          <van-cell-group>
            <!-- 下拉刷新 -->
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
              <!-- 列表 : 绑定上拉加载事件,以及绑定 -->
              <van-list
                v-model="upLoading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
              >
                <van-cell v-for="item in articles" :key="item">{{item}}</van-cell>
              </van-list>
            </van-pull-refresh>
          </van-cell-group>
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
export default {
  name: 'container-home',
  data () {
    return {
      // 下拉刷新
      isLoading: false,
      // 刷新成功提示信息
      refreshSuccessText: '',
      // 上拉加载中
      upLoading: false,
      // 是否全部加载,为true触发文字提示
      finished: false,
      // 文章列表
      articles: []
    }
  },
  methods: {
    // 加载
    onLoad () {
      // @load特点 : 默认在组件初始化会加载一次
      // @load特点 : 当加载的内容渲染后不足铺满屏幕,继续触发一次
      // @load事件触发条件 : 向上滑动到底部触发
      // 业务 : 获取列表数据进行渲染,先进行模拟
      window.setTimeout(() => {
        this.upLoading = false // 数据加载成功,结束加载动画
        const data = [] // 模拟数据
        for (let i = this.articles.length; i < this.articles.length + 10; i++) {
          data.push(i + 1) // 每加载一次,往后生成十条数据
        }
        this.articles.push(...data) // 追加到数据中
        if (this.articles.length >= 50) {
          this.finished = true // 判断总条数达到50条,显示已经加载全部
        }
      }, 1000) // 延时执行加载事件
    },
    // 刷新
    onRefresh () {
      window.setTimeout(() => { // 模拟网络耗时
        this.isLoading = false // 数据请求成功，结束正在刷新的效果
        const arr = [1, 2, 3, 4, 5, 6] // 模拟响应数据
        if (arr.length) { // 如果相应回来有数据
          this.articles = arr // 将回来的数据给文章列表
          this.refreshSuccessText = '刷新成功' // 给出刷新成功提示信息
          this.onLoad() // 回来的数据可能不够占满屏幕，调用一次上拉加载
          this.finished = false // 重置加载全部数据是否加载完毕
        } else {
          this.refreshSuccessText = '暂无更新' // 给刷新后没有获取到数据的提示
        }
      }, 1000)
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
</style>
