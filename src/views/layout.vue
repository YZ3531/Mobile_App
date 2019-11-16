<template>
  <div class="container">
    <!-- 顶部 -->
    <van-nav-bar fixed v-if="path!=='/user'" title="黑马头条" right-text="搜索" @click-right="$router.push('/search')" />
    <!-- 内容 -->
    <div class="my-wrapper" :class="{noTop:path==='/user'}">
      <router-view></router-view>
    </div>
    <!-- 底部 -->
    <van-tabbar v-model="active" route>
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/question" icon="chat-o">问答</van-tabbar-item>
      <van-tabbar-item to="/video" icon="video-o">视频</van-tabbar-item>
      <van-tabbar-item to="/user" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: 'container-layout',
  data () {
    return {
      active: 0
    }
  },
  computed: {
    // 取出当前页面hash值
    path () {
      return this.$route.path
    }
  }
}
</script>

<style lang="less">
.container{
    width: 100%;
    height: 100%;
    position: relative;
    .my-wrapper{
        width: 100%;
        height: 100%;
        padding: 46px 0 50px;
        overflow: hidden;
        box-sizing: border-box;
        &.noTop{
            padding-top: 0;
        }
    }
}
</style>
