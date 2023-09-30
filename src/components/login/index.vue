<template>
  <div>
    <el-dialog
      v-model="store.state.showlogin"
      :show-close="false"
      width="500px"
      align-center
      @close="closelogin"
    >
      <template #header="{titleId, titleClass }">
        <div class="my-header">
          <h4 :id="titleId" :class="titleClass">登录</h4>
          <el-button type="danger" @click="closelogin">
            <el-icon class="el-icon--left"><CircleCloseFilled /></el-icon>
            关闭
          </el-button>
        </div>
      </template>
      <el-form
        :model="user_info" 
        class="loginform"
        label-position="center"
        label-width="100px"
        style="max-width: 400px"
        :rules="loginrules"
        ref="loginform"
        @keyup.enter.native="submitForm()"
      >
        <el-form-item label="账号" prop="user_number">
          <el-input v-model="user_info.user_number" />
        </el-form-item>
        <el-form-item label="密码" prop="user_password">
          <el-input type="password" v-model="user_info.user_password" />
        </el-form-item>
        <div class="loginbutton">
          <el-form-item>
            <el-button  type="primary" @click="submitForm()">登录</el-button>
          </el-form-item>
          <el-form-item class="zhuce">
            <el-button type="info" @click="goregister">注册</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex";
const store = useStore();
import { ref } from "vue";
//路由
import { useRouter, useRoute } from "vue-router";
let $router = useRouter();
//Message 消息提示
import { ElMessage } from "element-plus";
const loginform=ref()
//用户信息
const user_info = ref({
  user_number: '',
  user_password: '',
});
//登录
const submitForm = () => {
  loginform.value.validate(valid => {
    // 通过了验证
    if (valid) {
      store.dispatch("login", user_info);
    }
  })

};
//关闭登录框
const closelogin=()=>{
  loginform.value.resetFields();
  user_info.value.user_number=''
  user_info.value.user_password=''
  store.state.showlogin=0
}
//校验账号规则
const validaccount = (rule, value, callback) => {
  if(value==""){
    callback("请输入账号");
  }else{
    callback();
  }

};
//校验密码规则
const validpassword= (rule, value, callback) => {
  if(value==""){
    callback("请输入密码");
  }else{
    callback();
  }
};
//校验
const loginrules = {
  user_number: [{validator: validaccount,trigger: "change",}],
  user_password: [{validator: validpassword,trigger: "change",}]
};
//跳转注册
const goregister=()=>{
  store.commit('changshowregister')
  store.state.showlogin=0
}
</script>

<style scoped>
.my-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.loginform button {
  margin:3px 10px;
  width: 80%
}
</style>
