<template>
  <div>
    <el-dialog
      v-model="store.state.showregister"
      :show-close="false"
      width="500px"
      align-center
      @close="closeregister"
    >
      <template #header="{ titleId, titleClass }">
        <div class="my-header">
          <h4 :id="titleId" :class="titleClass" v-if="store.state.identity=='用户'" >注册</h4>
          <h4 :id="titleId" :class="titleClass" v-else >添加管理员</h4>
          <el-button type="danger" @click="closeregister">
            <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
            关闭
          </el-button>
        </div>
      </template>
      <el-form
        :model="user_info"
        class="registerform"
        label-position="center"
        label-width="100px"
        style="max-width: 400px"
        :rules="registerrules"
        ref="registerform"
      >
        <el-form-item label="昵称" prop="user_name">
          <el-input v-model="user_info.user_name" />
        </el-form-item>
        <el-form-item label="账号" prop="user_number">
          <el-input v-model="user_info.user_number" />
        </el-form-item>
        <el-form-item label="密码" prop="user_password">
          <el-input type="password" v-model="user_info.user_password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="user_confirmpassword" >
          <el-input type="password" v-model="user_info.user_confirmpassword" :disabled="user_info.user_password==''?true:false"/>
        </el-form-item>
        <div class="registerbutton">
          <el-form-item>
            <el-button type="primary" @click="submitForm()" v-if="store.state.identity=='用户'">注册</el-button>
            <el-button type="primary" @click="submitForm()" v-else>添加</el-button>
          </el-form-item>
          <el-form-item class="zhuce" v-if="store.state.identity=='用户'" >
            <el-button type="info" @click="gologin">返回登录</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex"
const store = useStore()
import { ref } from "vue"
import axios from 'axios'
import qs from 'qs'
//路由
import { useRouter, useRoute } from "vue-router";
let $router = useRouter();
//Message 消息提示
import { ElMessage } from "element-plus";

//显示添加(父)
defineExpose({
    showaddadmin(){
        store.state.showregister = 1;
    }
})
//添加成功刷新
const RefreshadminListS = () => {
    $emit('RefreshadminListF')
}
let $emit =defineEmits(['RefreshadminListF']);
const registerform = ref();
//用户信息
const user_info = ref({
    user_name:"",
    user_number: "",
    user_password: "",
    user_confirmpassword:""
});
//注册/添加管理员
const submitForm = async() => {
  //表单验证
  await registerform.value.validate();
  try {
    let result =await axios.post("http://localhost/booksy/register.php", qs.stringify({
            user_name:user_info.value.user_name,
            user_number: user_info.value.user_number,
            user_password: user_info.value.user_password,
            identity:store.state.identity
    }))
    if(result.data=='yes'){
      if(store.state.identity=='用户'||store.state.identity==''){
        store.state.showlogin = 1;
        ElMessage({
          type:'success',
          message:'注册成功'
        })
      }else{
        ElMessage({
          type:'success',
          message:'添加成功'
        })
        RefreshadminListS()
      }
        store.state.showregister = 0;
    }else if(result.data=='exists'){
      ElMessage({
          type:'error',
          message:'账号已存在'
      })
    }else{
      if(store.state.identity=='用户'||store.state.identity==''){
        ElMessage({
          type:'error',
          message:'注册失败'
      })
      }else{
        ElMessage({
          type:'error',
          message:'注册失败'
      })
      }
   
    }
  } catch (error) {
    
  }

};
//关闭登录框
const closeregister = () => {
  registerform.value.resetFields();
  user_info.value.user_number = "";
  user_info.value.user_password = "";
  store.state.showregister = 0;
};
//校验姓名
const validname = (rule, value, callback) => {
  const regname = /^[\u4E00-\u9FA5]{2,5}$/;
  if (value=="") {
    callback("请输入姓名");
  }else if (regname.test(value)) {
    callback();
  } else {
    callback("姓名为2-5个字");
  }
};
//校验账号规则
const validaccount = (rule, value, callback) => {
  const regch = /^[\u4E00-\u9FA5]/;
  const special=/^[A-Za-z0-9]+$/
  if(regch.test(value)){
    callback("账号不能包含中文")
  }else if(!special.test(value)){
    callback("账号不能包含特殊符号\/:*?<|'%>")
  }else if(value.length>12||value.length<6){
    callback("密码长度不能小于6超过15");
  }else if (value == "") {
    callback("请输入账号");
  } else {
    callback();
  }
};
//校验密码规则
const validpassword = (rule, value, callback) => {
  const regnewpassword =/^((?!\\|\/|:|\*|\?|<|>|\||'|%).){1,12}$/
  if (value == "") {
    callback("请输入密码");
  }else if(/^\s/.test(value)){
    callback("不能包含空格");
  }else if(value.length>12||value.length<6){
    callback("密码长度不能小于6超过12");
  }else if (regnewpassword.test(value)) {
    callback();
  }else {
    callback("不能包含特殊字符\/:*?<|'%>");
  }
};
//再次校验密码规则
const validconfirmpassword = (rule, value, callback) => {
  if(value!=user_info.value.user_password){
    callback("两次密码不一致");
  }else if (value == "") {
    callback("请再次输入密码");
  } else {
    callback();
  }
};
//校验
const registerrules = {
  user_name: [{ validator: validname, trigger: "change" }],
  user_number: [{ validator: validaccount, trigger: "change" }],
  user_password: [{ validator: validpassword, trigger: "change" }],
  user_confirmpassword: [{ validator: validconfirmpassword, trigger: "change" }],
};
//返回登录
const gologin=()=>{
    store.commit('changshowlogin')
    store.state.showregister=0
}
</script>

<style scoped>
.my-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.registerform button {
  margin: 3px 10px;
  width: 80%;
}
</style>
