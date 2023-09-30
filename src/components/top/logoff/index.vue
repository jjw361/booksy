<template>
    <el-dialog
    v-model="logoffdisplay"
    title="注销"
    width="25%"
    center
    @close="logoffcleanvlaue"
  > 
  <div class="modify">
  <el-form 
  :model="userlogoff" 
  :rules="logoffrules"
  label-width="80px" 
  ref="logoffform"
  before-close="logoffcleanvlaue"
  >
    <el-form-item label="账号">
      <el-input disabled v-model="store.state.userLocalCache"/>
    </el-form-item>
    <el-form-item label="用户名">
      <el-input disabled  v-model="userlogoff.user_name"/>
    </el-form-item>
    <el-form-item label="密码" prop="user_logoffpassword">
      <el-input type="password" v-model="userlogoff.user_logoffpassword" placeholder="请输入密码"/>
    </el-form-item>
    <el-form-item>   
    <el-popconfirm
        width="220"
        confirm-button-text="确定"
        cancel-button-text="取消"
        icon-color="#626AEF"
        title="你确定要注销吗"
        @confirm="logoffuser()"
        >
        <template #reference>
            <el-button type="danger" style="width: 150px;" >注销</el-button>
        </template>
    </el-popconfirm>
    </el-form-item>
  </el-form>
</div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref,reactive, } from "vue";
import { useStore } from "vuex";
const store = useStore();
//Message 消息提示
import { ElMessage } from 'element-plus';
import axios from "axios";
import qs from "qs";
// 路由
import { useRouter } from "vue-router";
const $router = useRouter();
//localStorage
import LocalCache from "@/cache.ts";
//获取注销信息(父)
defineExpose({
    logoff(){
        logoffdisplay.value=true
        getuser_name()
    }
})
//注销框
const logoffdisplay=ref(false)
//注销表单
const logoffform = ref();
//注销用户信息
let userlogoff= reactive({
    user_name:'' ,
    user_logoffpassword:''
});
//获取用户姓名
const getuser_name=async()=>{
  let result = await axios.get("http://localhost/booksy/user.php", {
      params: {
        account: store.state.userLocalCache,
      },
  });
  if(result.status==200){
    userlogoff.user_name=result.data
  }
}
//清楚表单值
const logoffcleanvlaue=()=>{
    logoffform.value.resetFields();
    userlogoff.user_name=""
    userlogoff.user_logoffpassword=""
}

//校验密码规则
const validlogoffpassword = (rule, value, callback) => {
  if(value==""){
    callback("请输入密码");
  }else if(/^\s/.test(value)){
    callback("不能包含空格");
  }else{
    callback();
  }
};
//校验
const logoffrules = {
    user_logoffpassword: [{validator: validlogoffpassword,trigger: "change",}]
};
//确定注销
const logoffuser=async()=>{
    //表单校验
  await logoffform.value.validate();
  try {
    let result = await axios.post(
    "http://localhost/booksy/user_logoff.php",
    qs.stringify({
      user_logoffpassword:userlogoff.user_logoffpassword,
      account: store.state.userLocalCache,
    })
  );
  if(result.data==""){
    ElMessage({
      type:"error",
      message:"密码不能为空"
    })
  }else if(result.data=="olderror"){
    ElMessage({
      type:"error",
      message:"密码错误"
    })
  }else if(result.data=="didnot"){
    ElMessage({
      type:"error",
      message:"还有书本未归还,不能注销~"
    })
    logoffdisplay.value=false
    $router.push({path:"/index/Information"})
  }else if(result.data=="yes"){
    ElMessage({
      type:"success",
      message:"注销成功"
    })
    LocalCache.clearCache()
    store.commit('setidentity','')
    store.commit('setuserLocalCache',"")
    logoffdisplay.value=false
    $router.push({path:"/index"})
  }else if(result.data=="no"){
    ElMessage({
      type:"error",
      message:"注销失败"
    })
  }
  } catch (error) {}
}
</script>

<style scoped>

</style>