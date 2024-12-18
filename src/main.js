import { createApp } from 'vue'
import TDesign from 'tdesign-vue-next'
import { createRouter, createWebHistory } from 'vue-router'
import 'tdesign-vue-next/es/style/index.css'
import App from './App.vue'
import routes from './routes'

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 创建Vue应用实例
const app = createApp(App)

// 使用插件
app.use(TDesign)
app.use(router)

// 挂载应用
app.mount('#app') 