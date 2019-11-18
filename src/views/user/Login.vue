<template>
  <div class="container-login">
    <van-nav-bar title="登陆" left-text left-arrow @click-left="$router.back()" />
    <van-cell-group>
      <van-field
        @blur="checkMobile"
        v-model="loginForm.mobile"
        :error-message="errMsg.mobile"
        label="手机号"
        placeholder="请输入手机号"
      />
      <van-field
        @blur="checkCode"
        v-model="loginForm.code"
        :error-message="errMsg.code"
        label="验证码"
        placeholder="请输入验证码"
      >
        <van-button class="p5" slot="button" size="mini" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="btn_box">
      <van-button type="info" @click="login" block round>登 录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
// import store from '@/store'
export default {
  data () {
    return {
      // 登录数据
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      },
      // 错误信息
      errMsg: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    // 手机号校验
    checkMobile () {
      // 校验为空
      if (!this.loginForm.mobile) {
        this.errMsg.mobile = '手机号不可为空'
        return false
      }
      // 校验格式
      if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errMsg.mobile = '手机号格式错误'
        return false
      }
      // 符合校验
      this.errMsg.mobile = ''
    },
    // 验证码校验
    checkCode () {
      // 校验为空
      if (!this.loginForm.code) {
        this.errMsg.code = '验证码不可为空'
        return false
      }
      // 校验格式
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errMsg.code = '验证码格式错误'
        return false
      }
      // 符合校验
      this.errMsg.code = ''
    },
    // 登录校验
    async login () {
      this.checkMobile()
      this.checkCode()
      if (this.errMsg.mobile || this.errMsg.code) {
        return false
      }
      try {
        const data = await login(this.loginForm) // 登录请求
        this.setUser(data)
        const { redirectURL } = this.$route.query
        this.$router.push(redirectURL || '/user')
        this.$toast.success('登录成功')
      } catch (e) {
        this.$toast.fail('登录失败')
      }
    },
    ...mapMutations(['setUser'])
  }
}
</script>

<style>
</style>
