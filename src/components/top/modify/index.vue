<template>
    <!-- 修改信息 -->
  <el-dialog
    v-model="modifydisplay"
    title="修改信息"
    width="25%"
    center
    @close="modifycleanvlaue"
  > 
  <div class="modify">
  <!-- 用户 -->
  <el-form 
  v-if="store.state.identity=='用户'"
  :model="userinformation" 
  :rules="modifyrules"
  label-width="80px" 
  ref="modifyform"
  before-close="modifycleanvlaue"
  >
    <el-form-item label="账号">
      <el-input disabled v-model="store.state.userLocalCache"/>
    </el-form-item>
    <el-form-item label="用户名" prop="user_name">
      <el-input v-model="userinformation.user_name"/>
    </el-form-item>
    <el-form-item label="新密码" prop="user_newpassword">
      <el-input type="password" v-model="userinformation.user_newpassword" placeholder="不修改不用填写"/>
    </el-form-item>
    <el-form-item label="旧密码" prop="user_oldpassword">
      <el-input type="password" v-model="userinformation.user_oldpassword"/>
    </el-form-item>
    <el-form-item>
      <el-button @click="modifyuser()" type="primary" style="width: 150px;" >修改</el-button>
    </el-form-item>
  </el-form>
  <!-- 管理员 -->
  <el-form 
  v-if="store.state.identity!='用户'"
  :model="userinformationadmin" 
  :rules="modifyrules"
  label-width="100px" 
  ref="adminmodifyform"
  before-close="modifycleanvlaue"
  >
    <el-form-item label="账号" prop="user_number">
      <el-input disabled v-model="userinformationadmin.user_number"/>
    </el-form-item>
    <el-form-item label="用户名" prop="user_name">
      <el-input v-model="userinformationadmin.user_name"/>
    </el-form-item>
    <el-form-item label="新密码" prop="user_newpassword">
      <el-input type="password" v-model="userinformationadmin.user_newpassword" placeholder="不修改不用填写"/>
    </el-form-item>
    <el-form-item label="管理员密码" prop="admin_password">
      <el-input type="password" v-model="userinformationadmin.admin_password"/>
    </el-form-item>
    <el-form-item>
      <el-button @click="modifyuser" type="primary" style="width: 150px;" >修改</el-button>
    </el-form-item>
  </el-form>
</div>
  </el-dialog>
</template>

<script setup>
import { ref,reactive } from "vue";
import { useStore } from "vuex";
const store = useStore();
//Message 消息提示
import { ElMessage } from 'element-plus';
import axios from "axios";
import qs from "qs";
//修改显示
const modifydisplay=ref(false)
//用户信息
let userinformation = reactive({
  user_name:'',
  user_oldpassword:'',
  user_newpassword:''
});
//用户信息(管理员)
let userinformationadmin = reactive({
  user_id:'',
  user_name:'',
  user_number:'',
  admin_password:'',
  user_newpassword:''
});
//获取修改信息(父)
defineExpose({
    modify(){
        modifydisplay.value=true
        getuser_name()
    },
    adminmodify(modifyinfo){
        modifydisplay.value=true
        userinformationadmin.user_id=modifyinfo.user_id
        userinformationadmin.user_number=modifyinfo.user_number
        userinformationadmin.user_name=modifyinfo.user_name
    }
})
//获取用户姓名
const getuser_name=async()=>{
  let result = await axios.get("http://localhost/booksy/user.php", {
      params: {
        account: store.state.userLocalCache,
      },
  });
  if(result.status==200){
    userinformation.user_name=result.data
  }
}
//修改成功刷新
const RefreshModifyListS = () => {
    $emit('RefreshModifyListF')
}
let $emit =defineEmits(['RefreshModifyListF']);
//确认修改信息
const modifyuser=async()=>{
  if(store.state.identity=="用户"){
    //表单校验
  await modifyform.value.validate();
  try {
    let result = await axios.post(
    "http://localhost/booksy/user_modify.php",
    qs.stringify({
      user_identity:store.state.identity,
      userinfo_user_name:userinformation.user_name,
      userinfo_user_newpassword:userinformation.user_newpassword,
      userinfo_user_oldpassword:userinformation.user_oldpassword,
      account: store.state.userLocalCache,
    })
  );
  if(result.data==""){
    ElMessage({
      type:"error",
      message:"原密码或名字为空"
    })
  }else if(result.data=="olderror"){
    ElMessage({
      type:"error",
      message:"旧密码错误"
    })
  }else if(result.data=="yes"){
    ElMessage({
      type:"success",
      message:"修改成功"
    })
    modifydisplay.value=false
  }else if(result.data=="no"){
    ElMessage({
      type:"error",
      message:"修改失败"
    })
  }
  } catch (error) {
  }
  }else{
    //表单校验
  await adminmodifyform.value.validate();
  try {
    let result = await axios.post(
    "http://localhost/booksy/user_modify.php",
    qs.stringify({
      user_identity:store.state.identity,
      userinfoadmin_user_name:userinformationadmin.user_name,
      userinfoadmin_newpassword:userinformationadmin.user_newpassword,
      userinfoadmin_id:userinformationadmin.user_id,
      userinfoadmin_adminpassword:userinformationadmin.admin_password,
      userinfoadmin_usernumber:userinformationadmin.user_number,
      adminaccount:store.state.userLocalCache
    })
  );
  if(result.data==""){
    ElMessage({
      type:"error",
      message:"管理员密码为空"
    })
  }else if(result.data=="adminerror"){
    ElMessage({
      type:"error",
      message:"管理员密码错误"
    })
  }else if(result.data=="yes"){
    ElMessage({
      type:"success",
      message:"修改成功"
    })
    RefreshModifyListS()
    modifydisplay.value=false
  }else if(result.data=="no"){
    ElMessage({
      type:"error",
      message:"修改失败"
    })
  }
  } catch (error) {
  }
  }
}
//修改表单
const modifyform = ref();
//修改表单(管理员)
const adminmodifyform=ref();
//校验姓名
const validname = (rule, value, callback) => {
  const regname = /^[\u4E00-\u9FA5]{2,5}$/;
  if (regname.test(value)) {
    callback();
  } else {
    callback("姓名为2-5个字");
  }
};
//校验新密码规则
const validnewpassword = (rule, value, callback) => {
  const regnewpassword =/^((?!\\|\/|:|\*|\?|<|>|\||'|%).){1,12}$/
  if(value==""){
    callback();
  }else if(/^\s/.test(value)){
    callback("不能包含空格");
  }else if(value.length>12||value.length<6){
    callback("密码长度不能小于6超过12");
  }else if (regnewpassword.test(value)) {
    callback();
  } else {
    callback("不能包含特殊字符\/:*?<|'%>");
  }
};
//校验旧密码规则
const validoldpassword = (rule, value, callback) => {
  if(value==""){
    callback("请输入密码");
  }else if(/^\s/.test(value)){
    callback("不能包含空格");
  }else{
    callback();
  }
};
//校验管理员密码
const validadminpassword=(rule, value, callback)=>{
  if(!value){
    callback("请输入管理员密码");
  }else{
    callback();
  }
}
//校验
const modifyrules = {
  user_name: [{ validator: validname, trigger: "change" }],
  user_newpassword: [{validator: validnewpassword,trigger: "change",}],
  user_oldpassword: [{validator: validoldpassword,trigger: "change",}],
  admin_password:[{validator: validadminpassword,trigger: "change",}]
};
//清除表单值
const modifycleanvlaue=()=>{
  if(store.state.identity=='用户'){
    modifyform.value.resetFields();
    userinformation.user_name=""
    userinformation.user_oldpassword=""
    userinformation.user_newpassword=""
  }else{
    adminmodifyform.value.resetFields();
    userinformationadmin.user_id=""
    userinformationadmin.user_name=""
    userinformationadmin.user_newpassword=""
    userinformationadmin.user_number=""
  }
    
}

</script>

<style scoped>

</style>