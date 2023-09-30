<template>
     <el-dialog @close="closedeletedialog" v-model="deletedisplay" title="删除账号" width="25%" center>
            <div class="modify">
                <el-form :model="deleteinfo" ref="deleteform" :rules="deleterules" label-width="100px"
                    before-close="modifycleanvlaue">
                    <el-form-item label="删除的账号">
                        <el-input disabled v-model="deleteinfo.user_number" />
                    </el-form-item>
                    <el-form-item label="管理员账号">
                        <el-input disabled v-model="deleteinfo.admin_account" />
                    </el-form-item>
                    <el-form-item label="管理员密码" prop="admin_password">
                        <el-input v-model="deleteinfo.admin_password" />
                    </el-form-item>
                    <el-form-item>
                        <el-popconfirm title="你确定要删除吗" confirm-button-text="确定" cancel-button-text="取消"
                            @confirm="deleteuser">
                            <template #reference>
                                <el-button  type="primary" style="width: 150px;">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
</template>

<script setup>
//Message 消息提示
import { ElMessage } from 'element-plus';
import { onMounted, ref,reactive } from "vue";
import { useStore } from "vuex";
const store = useStore();
import axios from "axios";
import qs from "qs";
//删除框
const deletedisplay=ref(false)
//删除账号信息
const deleteinfo=reactive({
  user_number:"",
  user_id:"",
  admin_account:store.state.userLocalCache,
  admin_password:""
}
)
const deleteform =ref()
//获取删除信息(父)
defineExpose({
    showdeletedialog(deleteinfoinfo){
        deletedisplay.value=true
        deleteinfo.user_number=deleteinfoinfo.user_number
        deleteinfo.user_id=deleteinfoinfo.user_id
    }
})
//删除用户
const deleteuser = async () => {
    await deleteform.value.validate();
    let result =await axios.post("http://localhost/booksy/deleteuser.php", qs.stringify({
            deleteinfo:deleteinfo
    }))
    console.log(result.data);
    if(result.data=="yes"){
        ElMessage({
        type:"success",
        message:"删除成功"
        })
        deletedisplay.value=false;
        RefreshDeleteListS()
    }else if(result.data=="borrowno"){
        ElMessage({
        type:"error",
        message:"该用户还有书未归还"
        })
    }else if(result.data=="pwno"){
        ElMessage({
        type:"error",
        message:"管理员密码错误"
        })
    }else{
        ElMessage({
        type:"error",
        message:"删除失败"
        })
    }
};
//删除成功刷新
const RefreshDeleteListS = () => {
    $emit('RefreshDeleteListF')
}
const closedeletedialog=()=>{
    deleteinfo.admin_password=""
    deleteform.value.resetFields()
}
let $emit =defineEmits(['RefreshDeleteListF']);
//校验密码规则
const validadminpassword = (rule, value, callback) => {
  if(!value){
    callback("请输入密码");
  }else {
    callback();
  }
};
//校验
const deleterules = {
  admin_password: [{validator: validadminpassword,trigger: "change",}],
};

</script>

<style lang="scss" scoped>

</style>