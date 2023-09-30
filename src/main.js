import { createApp } from 'vue'
//清除默认样式
import './style.css'
//全局组件
import  Top from '@/components/top/index.vue'
import  Login from '@/components/login/index.vue'
import  Register from '@/components/register/index.vue'
import App from './App.vue'
//引入ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入ElementPlus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//路由
import router from './router/router'
//vuex
import vuex from '@/store/store'
// 创建实例
const app=createApp(App)

//使用ElementPlus
app.use(ElementPlus)
//使用ElementPlus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
//国际化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
app.use(ElementPlus, {
    //国际化
    locale: zhCn,
})
//暗黑模式
import 'element-plus/theme-chalk/dark/css-vars.css'
//安装路由
app.use(router)
//安装vuex
app.use(vuex)
//使用全局组件
app.component('Top',Top)
app.component('Login',Login)
app.component('Register',Register)
import './router/permisstion'
//挂载
app.mount('#app')
