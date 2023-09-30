// 路由鉴权:就是路由能不能被访问到权限设置->全局守卫完成
//axios
import axios from 'axios';
//localStorage
import LocalCache from "@/cache.ts";
//Message 消息提示
import { ElMessage } from "element-plus"
// 引入路由器
import router from "@/router/router";
//引入进度条
import Nprogress from 'nprogress';
//引入用户相关的仓库
import store from "../store/store";
//引入进度条的样式
import "nprogress/nprogress.css"
//进度条的加载小圆球不要
Nprogress.configure({ showSpinner: false });
//存储用户未登录可以访问路由得路径
let whiteList = ["/index/home", "/index/Hot", "/index/ALL", "/index/HotDetail"];
//存储用户登录可以访问路由得路径
let whiteListlogin = ["/index/home", "/index/Hot", "/index/ALL", "/index/HotDetail",, "/index/History", "/index/Information"];
//添加相应的全局守卫
//前置守卫
router.beforeEach((to, from, next) => {
    //访问路由组件的之前,进度条开始动
    Nprogress.start();
    //动态设置网页左上角的标题
    document.title = `图书管理系统-${to.meta.title}`;
    //判断用户是否登录-token
    let token = store.state.userLocalCache;
    //判断用户身份
    let identity = store.state.identity
    //用户登陆了
    const Querylogin = async () => {
        await axios.get('http://localhost/booksy/Querylogin.php',
            { params: { account: LocalCache.getCache('user') } }).then(({ data }) => {
                if (data == 'no') {
                    LocalCache.clearCache()
                    store.commit('setuserLocalCache', "")
                    store.commit('setidentity', '')
                    ElMessage({
                        type: 'error',
                        message: '登录状态失效,请重新登录'
                    })
                    next({ path: '/index' })
                } else {
                    if (token) {
                        if (identity == '用户') {
                            if (!whiteListlogin.includes(to.path)) {
                                ElMessage({
                                    type: 'error',
                                    message: '你没有权限访问该页面'
                                })
                                next({ path: '/index/home' })
                            } else {
                                next();
                            }
                        } else {
                            next();
                        }
                    } else {
                        //用户未登录
                        if (whiteList.includes(to.path)) {
                            next();
                        } else {
                            //登录组件显示不来
                            store.state.showlogin = 1;
                            next({ path: '/index/home' })
                        }
                    }
                }

            })
    }
    Querylogin()

});

//后置路由
router.afterEach((to, from) => {
    //访问路由组件成功,进度条消息
    Nprogress.done();
})