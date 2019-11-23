<template>
  <div class="container">
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />
    <van-list v-model="uploading" @load="onLoading" :finished="finished" finished-text="没有更多了">
      <van-cell-group>
        <!-- to进行跳转路由，传递本条信息ID到详情页 -->
        <van-cell :to="{name:'article',params:{id:item.art_id.toString()}}" v-for="item in  articles" :key="item.art_id.toString()">
          <div class="article_item">
            <h3 class="van-ellipsis">{{item.title}}</h3>
            <div class="img_box" v-if="item.cover.type===3">
              <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[1]"  />
              <van-image class="w33" fit="cover" :src="item.cover.images[2]"  />
            </div>
            <div class="img_box" v-if="item.cover.type===1">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]"  />
            </div>
            <div class="info_box" >
              <span>{{item.aut_name}}</span>
              <span>{{item.comm_count}}评论</span>
              <span>{{item.pubdate|relTime}}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
import { searchArticle } from '@/api/article'
export default {
  name: 'search-result',
  data () {
    return {
      uploading: false, // 加载状态
      finished: false, // 是否加载完毕
      // 发送搜索请求携带参数
      reqParams: {
        page: 1,
        q: this.$route.query.key
      },
      articles: [] // 请求回来的数据数组
    }
  },
  methods: {
    // 上拉加载
    async onLoading () {
      // 调用API根据数据获取搜索结果
      const data = await searchArticle(this.reqParams)
      console.log(data)
      // 将搜索结果添加到数据数组中
      this.articles.push(...data.results)
      // 关闭加载状态
      this.uploading = false
      if (!data.results.length) {
        // 如果响应体没有数据了，打开加载完毕状态，提示信息
        this.finished = true
      } else {
        // 还有数据，就将上次请求页码数再次加1，以便下次请求
        this.reqParams.page++
      }
    }
  },
  created () {
    // console.log(this.reqParams)
  }
}
</script>

<style lang='less' scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
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
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
