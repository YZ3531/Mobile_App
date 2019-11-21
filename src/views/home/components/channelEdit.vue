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
          <van-icon @click="delChannel(item.id,index)" v-if="editing&&index!==0" class="btn" name="cross" ></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannels" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <van-icon @click="addChannel(item)" v-if="editing" class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </van-action-sheet>
</template>

<script>
import { getAllChannels, delChannel, addChannel } from '@/api/channel'
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
    // 添加频道
    async addChannel ({ id, name }) {
      try {
        // 包装传参,支撑接口调用,支撑本地存储
        // 接口需要 id,seq
        // 本地需要 id,name
        // 最终数据 id,seq,name
        const orderChannels = this.myChannels.map((item, i) => {
        // 转换我的频道数据格式,添加新字段seq,为满足调用接口使用
          return {
            id: item.id,
            name: item.name,
            seq: i
          }
        })
        // 添加新频道到我的频道数组中
        orderChannels.push({ id, name, seq: orderChannels.length })
        // 后台数据不需要 推荐 这一项频道
        orderChannels.splice(0, 1)
        // 调用添加API
        await addChannel(orderChannels)
        // 提示信息
        this.$toast.success('添加成功')
        // 在我的数组中对新添加的频道补全信息
        this.myChannels.push({
          id,
          name,
          articles: [],
          upLoading: false,
          downLoading: false,
          finished: false,
          timestamp: Date.now(),
          scrollTop: 0

        })
      } catch (e) {
        this.$toast.fail('添加失败')
      }
    },
    // 删除频道
    async delChannel (id, index) {
      try {
        await delChannel(id) // 内存中删除
        this.$toast.success('删除成功') // 提示信息
        if (index <= this.activeIndex) { // 如果当前删除的频道在选中频道之前(索引小于选中频道索引,在选中频道左侧)
          this.$emit('update:activeIndex', this.activeIndex - 1) // 通知父组件更改选中频道往前移一位,便于正确对应选中频道
        }
        this.myChannels.splice(index, 1) // 在我的频道数组中删除对应索引的频道--myChannel是双向绑定的
        this.$emit('on-delete') // 通知父组件刷新页码,完成数据中的删除
      } catch (e) {
        this.$toast.fail('删除失败') // 提示信息
      }
    },
    // 点击进入频道
    enterChannel (index) {
      // console.log(index)
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
