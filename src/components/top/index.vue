<template >
  <div :class=topbackg>
    <div class="Book_Top_Left">
      <img src="/img/headbook.png" />
      <el-text size="large">图书管理系统</el-text>
    </div>
    <div class="Book_Top_Right">
      <el-switch
      class="modeswitch"
      v-model="mode"
      :active-action-icon="Sunny"
      :inactive-action-icon="Moon"
      style="--el-switch-on-color: #cecdcd; --el-switch-off-color:#292929"
      size="large"
      inline-prompt
      active-text="日间"
      inactive-text="夜间"
      @change="toggleDark"
    />
      <div class="login" v-if="!store.state.userLocalCache">
        <el-text  @click="loginstate()" >登录/注册</el-text>
      </div>
      <div class="txan" v-else>
        <el-dropdown trigger="click" size="large" placement="bottom-end">
          <span class="el-dropdown-link">
            欢迎你！ <span :style="store.state.identity=='用户'?usercolor:admincolor"><span style="font-size: 18px;margin-right: 5px;">{{ $store.state.identity }}</span></span> <span>{{ $store.state.userLocalCache }}</span>
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logoff" v-if="store.state.identity=='用户'||''">注销</el-dropdown-item>
              <el-dropdown-item @click="modify" v-if="store.state.identity=='用户'||''">修改</el-dropdown-item>
              <el-dropdown-item @click="layout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
  <!-- 修改信息 -->
  <Modify ref="Modifychlid"></Modify>
  <!-- 注销 -->
  <Logoff ref="Logoffchlid"></Logoff>
</template>

<script setup>
import { Sunny, Moon } from '@element-plus/icons-vue'
//暗黑模式
const mode = ref(true)
const toggleDark = () => {
  const html = document.querySelector('html')
  const home_bottom = document.querySelector('.home_bottom')
  if (html) {
    if (mode.value) {
      topbackg.value='Book_Top'
      if(home_bottom!=null){
        home_bottom.classList.remove('home_bottomback')
      }
      html.classList.remove("dark");
      html.classList.add("light");
    } else {
      topbackg.value='Book_Top Book_Top_Dark'
      if(home_bottom!=null){
        home_bottom.classList.add('home_bottomback')
      }
      html.classList.remove("light");
      html.classList.add("dark");
    }
}
}
//顶部样式
const topbackg=ref('Book_Top')
//修改
import Modify from '../top/modify/index.vue'
//注销
import Logoff from '../top/logoff/index.vue'
import { ref,reactive, } from "vue";
import { useStore } from "vuex";
const store = useStore();
//localStorage
import LocalCache from "@/cache.ts";
//路由
import {useRouter,useRoute} from 'vue-router'
let $router=useRouter()
//Message 消息提示
import { ElMessage } from 'element-plus';
//登录框
const loginstate = () => {
    store.commit("changshowlogin");
};
//身份颜色
const usercolor=ref("color:rgb(92, 200, 110)")
const admincolor=ref("color:red")

//退出登录
const layout=()=>{
  LocalCache.clearCache()
  ElMessage({
      message: '退出成功',
      type: 'success',
  })
  store.commit('setuserLocalCache','')
  store.commit('setidentity','')
  $router.push({path:"/index"})
}
//调用子组件方法修改
const Modifychlid=ref()
const modify=()=>{
  Modifychlid.value.modify();
}

//调用子组件方法注销
const Logoffchlid=ref()
const logoff=()=>{
  Logoffchlid.value.logoff();
}
</script>

<style scoped>
/* 顶部 */

.Book_Top {
  z-index: 999;
  height: 65px;
  width: 100%;
  box-shadow: 0 3px 5px rgba(195, 195, 195, 0.7);
  background-color: rgba(255, 255, 255, 1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.Book_Top_Dark{
  background-color:#141414;;
  box-shadow: 0 3px 3px rgba(39, 39, 39, 0.7);
}
.Book_Top_Left {
  width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.Book_Top_Left img {
  height: 60px;
}
.Book_Top_Right {
  margin-right: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modify{
  margin: 0 auto;
  width: 300px;
}
.modeswitch{
  margin-right: 20px;
}
</style>
