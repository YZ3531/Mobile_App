<template>
  <div class="container-question">
      <van-skeleton title avatar :row="3" />
      <van-skeleton title avatar :row="3" />
      <van-skeleton title avatar :row="3" />
  </div>
</template>

<script>
export default {
  name: 'container-question'
}
</script>

<style>
.van-skeleton{
  margin-top: 10px;
}
</style>
