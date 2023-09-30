import { createStore } from 'vuex'
import LocalCache from "../cache";
import axios from "axios";
import qs from "qs";
//Message 消息提示
import { ElMessage } from "element-plus";
//路由
import { useRouter, useRoute } from "vue-router";
let $router = useRouter();
const store = createStore({
    state() {
        return {
            //登录
            showlogin: 0,
            //注册
            showregister:0,
            //身份
            identity:LocalCache.getCache('useridentity') || '',
            userinfo: {
                usernumber: '',
                userpassword: ''
            },
            //登录信息
            userLocalCache: LocalCache.getCache('user') || '',
            bookInfo: '',
            //书籍数量
            booktotal:'',
            //还书信息
            bookreturnkInfo:'',
            //借书信息
            borrowbookInfo:'',
            //公告
            Notice:{ },
            //管理用户身份
            Users:''
        }
    },
    mutations: {
        //登录框
        changshowlogin(state) {
            state.showlogin = 1
        },
        //注册框
        changshowregister(state) {
            state.showregister = 1
        },
        //身份
        setidentity(state,identity) {
            state.identity = identity
        },
        //收集用户账号面膜
        collectuserinfo(state, user_info) {
            state.userinfo.usernumber = user_info.value.user_number
            state.userinfo.userpassword = user_info.value.user_password
        },
        //存储LocalCache
        setuserLocalCache(state, userLocalCache) {
            state.userLocalCache = userLocalCache
        },
        //存储书籍信息
        setbookInfo(state, bookInfo) {
            state.bookInfo = bookInfo
        },
        //存储书籍数量
        setbooktotal(state, booktotal) {
            state.booktotal = booktotal
        },
        //存储还书书籍信息
        setreturnbookInfo(state, returnbookInfo) {
            state.bookreturnkInfo = returnbookInfo
        },
        //存储借书书籍信息
        setborrowbookInfo(state, borrowbookInfo) {
            state.borrowbookInfo = borrowbookInfo
        },
        //存储公告
        setNotice(state,Notice){
            state.Notice=Notice
        },
        //存储用户信息
        setUsers(state,Users){
            state.Users=Users
        }
    },
    actions: {
        //登录
        login: (context, userinfo) => {
             axios.post("http://localhost/booksy/login.php", qs.stringify({
                user_umber: userinfo.value.user_number,
                user_password: userinfo.value.user_password,
            })).then(({ data }) => {
                if(data.trim()!="no"){
                    store.state.showlogin = 0;
                    LocalCache.setCath('user', userinfo.value.user_number)
                    context.commit('setuserLocalCache', LocalCache.getCache('user'))
                    //设置用户身份
                    LocalCache.setCath('useridentity', data.trim())
                    context.commit('setidentity', LocalCache.getCache('useridentity'))
                    ElMessage({
                        message: "登录成功",
                        type: "success",
                    }); 
                }else{
                    ElMessage({
                        message: "账号或密码错误",
                        type: "error",
                    });    
                }

            })
        },
        //书籍信息
        book: (context, page) => {
            axios.post("http://localhost/booksy/book.php", qs.stringify({
                pageNo: page.value.pageNo,
                pageNumber: page.value.pageNumber,
                bookname:page.value.bookname
            })).then(
                ({ data }) => {
                    context.commit('setbookInfo', data)
                })
        },
        //还书书籍信息
        returnbook: (context, page) => {
            axios.post("http://localhost/booksy/returnbook.php", qs.stringify({
                pageNo: page.value.pageNo,
                pageNumber: page.value.pageNumber,
                account:store.state.userLocalCache,
                user_number:page.value.user_number,
                bookname:page.value.bookname
            })).then(
                ({ data }) => {
                    context.commit('setreturnbookInfo', data)
                })
        },
        //借书书籍信息
        borrowbook: (context,page) => {
            axios.post("http://localhost/booksy/borrowbook.php", qs.stringify({
                pageNo: page.value.pageNo,
                pageNumber: page.value.pageNumber,
                account:store.state.userLocalCache,
                user_number:page.value.user_number,
            })).then(
                ({ data }) => {
                    context.commit('setborrowbookInfo', data)
                })
        },
        //公告
        Notice: (context) => {
            axios.get("http://localhost/booksy/Notice.php").then(
                ({ data }) => {
                    context.commit('setNotice', data)
                })
        },
        //用户
        Users: (context,page) => {
            axios.get("http://localhost/booksy/Users.php",{
                params:{
                    pageNo: page.value.pageNo,
                    pageNumber: page.value.pageNumber,
                    identity:page.value.user_identity,
                    user_number: page.value.user_number,
                }}).then(
                ({ data }) => {
                    context.commit('setUsers', data)
                })
        },
    }
})
export default store 
