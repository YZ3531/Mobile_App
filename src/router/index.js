import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home/Index')
const Question = () => import('@/views/question/Index')
const Video = () => import('@/views/video/Index')
const User = () => import('@/views/user/Index')
const Profile = () => import('@/views/user/Profile')
const Chat = () => import('@/views/user/Chat')
const Login = () => import('@/views/user/Login')
const Search = () => import('@/views/search/Index')
const Result = () => import('@/views/search/Result')
const Article = () => import('@/views/home/Article')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/', name: 'home', component: Home, meta: { keepAlive: true } },
      { path: '/question', name: 'question', component: Question },
      { path: '/video', name: 'video', component: Video },
      { path: '/user', name: 'user', component: User }
    ]
  },
  { path: '/user/profile', name: 'profile', component: Profile },
  { path: '/user/chat', name: 'chat', component: Chat },
  { path: '/login', name: 'login', component: Login },
  { path: '/search', name: 'search', component: Search },
  { path: '/search/result', name: 'result', component: Result },
  { path: '/article/:id', name: 'article', component: Article, meta: { keepAlive: true } }
]

const router = new VueRouter({
  routes
})
// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 取出vuex中的用户状态
  const user = store.state.user
  // 如果用户尚未登陆，并且是去user开头的路由
  if (!user.token && to.path.startsWith('/user')) {
    // 将他拦截下来，让他取登陆页面
    return next({ path: '/login', query: { redirectURL: to.path } })
  }
  // 其余放行
  next()
})
export default router
