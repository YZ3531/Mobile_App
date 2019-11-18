import dayjs from 'dayjs' // dayjs导包
import relativeTime from 'dayjs/plugin/relativeTime' // 导入dayjs插件
import 'dayjs/locale/zh-cn' // 中文简体格式
dayjs.extend(relativeTime)// 依赖相对时间 依赖dayjs的插件RelativeTime
const relTime = (time) => {
  // dayjs()获取当前时间  .from(time)获取相对时间  语言本地化local
  return dayjs().locale('zh-cn').from(time)
}
export default {
  install (Vue) {
    // Vue.filter('过滤器名',(value)=>{处理函数})  value管道符前js表达式结果
    Vue.filter('relTime', relTime) // 注册全局过滤器,用来转换时间格式
  }
}
