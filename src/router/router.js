import { createRouter, createWebHistory } from "vue-router";
export default createRouter({
  //路由模式
  history: createWebHistory(),
  //管理路由
  routes: [
    {
      path: "/index",
      component: () => import("@/page/index.vue"),
      //默认访问
      redirect: "/index/home",
      children: [
        {
          //主页
          path: "home",
          component: () => import("../page/user/home/index.vue"),
          meta:{
            title:"首页"
          }
        },
        {
          //所有书籍
          path: "All",
          component: () => import("../page/user/books/All/index.vue"),
          meta:{
            title:"书籍"
          }
        },
        {
          //热门书籍
          path: "Hot",
          component: () => import("../page/user/books/Hot/index.vue"),
          meta:{
            title:"热门书籍"
          }
        },
        {
          //热门书籍详细
          path: "HotDetail",
          component: () => import("../page/user/books/Detail/index.vue"),
          meta:{
            title:"书籍详细"
          }
        },
        {
          //借阅历史
          path: "History",
          component: () => import("../page/user/Borrowing/History/index.vue"),
          meta:{
            title:"借阅历史"
          }
        },
        {
          //借阅信息
          path: "Information",
          component: () => import("../page/user/Borrowing/Information/index.vue"),
          meta:{
            title:"借阅信息"
          }
        },
        {
          //发布公告
          path: "Notice",
          component: () => import("../page/admin/Notice/index.vue"),
          meta:{
            title:"发布公告"
          }
        },
        {
          //添加编辑书本
          path: "AddEditBook",
          component: () => import("../page/admin/books/AddEditbook/index.vue"),
          meta:{
            title:"添加书本"
          }
        },
        {
          //还书管理
          path: "Returnbook",
          component: () => import("../page/admin/books/Returnbook/index.vue"),
          meta:{
            title:"还书管理"
          }
        },
        {
          //还书管理
          path: "Borrowbook",
          component: () => import("../page/admin/books/Borrowbook/index.vue"),
          meta:{
            title:"借书管理"
          }
        },
        {
          //用户管理
          path: "Managingusers",
          component: () => import("../page/admin/managing/index.vue"),
          meta:{
            title:"用户管理"
          }
        }
      ],
    },
    {
      path:'/',
      redirect:'/index'
    },
  ],
});




