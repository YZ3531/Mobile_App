<template>
  <van-action-sheet
    :value="value"
    @closed="editing=false"
    @input="$emit('input', $event)"
    title="编辑频道"
  >
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,index) in myChannels" :key="index">
          <span class="f12"  :class="{red:index===activeIndex}" @click="enterChannel(index)">{{item.name}}</span>
          <van-icon v-if="editing&&index!==0" class="btn" name="cross" ></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="index in optionalChannels" :key="index.id">
          <span class="f12">{{index.name}}</span>
          <van-icon v-if="editing" class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </van-action-sheet>
</template>

<script>
import { getAllChannels } from '@/api/channel'
export default {
  props: {
    value: { // 是否显示
      type: Boolean,
      default: false
    },
    myChannels: { // 我的频道
      type: Array,
      default: () => []
    },
    activeIndex: { // 选中频道
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      editing: false,
      allChannels: []
    }
  },
  methods: {
    // 点击进入频道
    enterChannel (index) {
      console.log(index)
      if (!this.editing) {
        this.$emit('input', false)
        // this.$emit('update', index)
        this.$emit('update:activeIndex', index) // 使用update（固定写法）更改activeIndex的值，传入新的值给父组件
      }
    },
    // 获取所有频道
    async getAllChannels () {
      const data = await getAllChannels()
      this.allChannels = data.channels
    }
  },
  computed: {
    optionalChannels () {
      return this.allChannels.filter(item => this.myChannels.findIndex(i => i.id === item.id) === -1)
    }
  },
  created () {
    this.getAllChannels()
  }
}
</script>

<style lang='less' scoped>
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  border-radius: 0;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.channel {
  padding: 10px;
  .tit{
    line-height: 3;
    .tip {
      font-size: 10px;
      color: #999;
    }
  }
  .van-button {
    float: right;
    margin-top: 7px;
  }
  .btn{
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ddd;
    font-size: 12px;
    color: #fff;
  }
  .f12{
      font-size:12px;
      color: #555;
  }
  .red{
    color: red;
  }
}
</style>
