<template>
  <div class="container-profile">
    <van-nav-bar
      title="编辑资料"
      left-text
      right-text="保存"
      left-arrow
      @click-left="$router.back()"
      @click-right="save"
    />
  </div>
</template>

<script>
export default {
  name: 'container-profile',
  methods: {
    save () {
      this.$toast.success('保存成功')
    }
  }
}
</script>

<style>
</style>
