<template >
    <div class="Managing_top">
        <div class="Managing_top_left">
            <el-switch size="large" v-model="identity" style="--el-switch-on-color: #13ce66; 
            --el-switch-off-color: #ff4949" @change="Switchidentity" active-text="用户" inactive-text="管理员" />
        </div>
        <div class="Managing_top_right">
            <el-button v-if="identity == false" class="addbook" type="primary" @click="showAddAdmindialog">
                添加管理员
            </el-button>
        </div>

    </div>
    <div class="Managing">
        <div class="Managing_search">
            <el-autocomplete v-model="Managingaccount" :fetch-suggestions="finduserManagingaccount" clearable
                class="inline-input w-50" :trigger-on-focus="false" placeholder="请输入账号" />
            <el-button @click="finduseraccount" :disabled="!Managingaccount ? true : false">搜索</el-button>
            <el-button @click="cleanbook_name">重置</el-button>
        </div>
        <!-- 用户 -->
        <el-scrollbar height="50vh" v-if="identity">
            <el-table :data="store.state.Users" border style="width: 100%" :row-style="{ height: '60px' }"
                empty-text="暂无用户">
                <el-table-column prop="user_identity" label="身份" align="center" />
                <el-table-column prop="user_name" label="用户名" align="center" />
                <el-table-column prop="user_number" label="用户账号" align="center" />
                <el-table-column label="借书量" align="center">
                    <template #default="scope">
                        {{ 5 - scope.row.max_number }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template #default="scope">
                        <el-button @click="showmodifydialog(scope.row)" color="#aec4b7" >修改</el-button>
                        <el-button @click="showdeletedialog(scope.row)" color="#aec4b7">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-scrollbar>
        <!-- 管理员 -->
        <el-scrollbar height="50vh" v-if="!identity">
            <el-table :data="store.state.Users" border style="width: 100%" :row-style="{ height: '60px' }"
                empty-text="暂无管理员">
                <el-table-column label="身份" align="center">
                    <template #default="scope">
                        <span style="color: red;"> {{ scope.row.user_identity }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="user_name" label="管理员名" align="center" />
                <el-table-column prop="user_number" label="管理员账号" align="center" />
                <el-table-column label="操作" align="center" v-if="store.state.identity=='超级管理员'">
                    <template #default="scope">
                        <el-button color="#aec4b7" @click="showmodifydialog(scope.row)">修改</el-button>
                        <el-button @click="showdeletedialog(scope.row)" color="#aec4b7">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-scrollbar>
        <!-- 分页 -->
        <div class="Managing_page" v-if="store.state.Users">
            <el-config-provider :locale="zhCn">
                <el-pagination background v-model:current-page="page.pageNo" v-model:page-size="page.pageNumber"
                    :page-sizes="[6, 12]" layout="total, sizes, prev, pager, next, jumper" :total="total"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange" />
            </el-config-provider>
        </div>
        <Delete ref="Deletechlid"  @RefreshDeleteListF="successdelete"/>
        <Modify ref="Modifychild"  @RefreshModifyListF="successModify"/>
        <AddAdmin ref="AddAdminchild" @RefreshadminListF="successAddAdmin"/>
    </div>
</template>
  
<script setup lang="ts">
//添加管理员子组件
import AddAdmin from '@/components/register/index.vue'
//删除子组件
import Delete from './delete/idnex.vue'
//修改子组件
import Modify from '@/components/top/modify/index.vue'
//Message 消息提示
import { ElMessage } from "element-plus";
//中文
import zhCn from "element-plus/es/locale/lang/zh-cn";
import axios from "axios";
import qs from "qs";
import { onMounted, ref,reactive } from "vue";
import { useStore } from "vuex";
const store = useStore();
//总页数
const total = ref();
const ManagingInfo = ref("");
//账号
const Managingaccount = ref();
//切换身份
const identity = ref(true)
// 分页
const page = ref({
    // 第几页
    pageNo: 1,
    //一页几条
    pageNumber: 6,
    user_number: "",
    user_identity: "用户",
});
onMounted(() => {
    store.dispatch('Users', page)
    getbooktotal();
});
//切换管理的用户
const Switchidentity = () => {
    Managingaccount.value = ""
    page.value.user_number = "";
    if (identity.value == true) {
        page.value.user_identity = "用户"
        store.dispatch('Users', page)
        getbooktotal();
    } else {
        page.value.user_identity = "管理员"
        store.dispatch('Users', page)
        getbooktotal();
    }
}
//获取书的总数
const getbooktotal = async () => {
    let result = await axios.get("http://localhost/booksy/Managingtotal.php", {
        params: { identity: page.value.user_identity },
    });
    total.value = result.data;
};
//下拉框变化
const handleSizeChange = (pageNumber) => {
    page.value.user_number = Managingaccount.value;
    page.value.pageNumber = pageNumber;
    store.dispatch('Users', page)
};
//页数
const handleCurrentChange = (pageNo) => {
    page.value.user_number = Managingaccount.value;
    page.value.pageNo = pageNo;
    store.dispatch('Users', page)
};
//储存账号
const finduserManagingaccount = async (keyword, cb) => {
    let result = await axios.post(
        "http://localhost/booksy/finduserManagingaccount.php",
        qs.stringify({
            identity: page.value.user_identity,
            Managingaccount: keyword,
        })
    );
    //存储借书账号
    let Managingaccountarr = [];
    ManagingInfo.value = result.data;
    if (ManagingInfo.value != null) {
        // 借书账号去重
        for (let i = 0; i < result.data.length; i++) {
            if (Managingaccountarr.indexOf(result.data[i].user_number) === -1) {
                Managingaccountarr.push(result.data[i].user_number);
            }
        }
    }
    let showData = Managingaccountarr.map((item) => {
        return {
            //借书账号
            value: item
        };
    });
    cb(showData);
};
//查找书本
const finduseraccount = () => {
    page.value.user_number = Managingaccount.value;
    if (ManagingInfo.value == null) {
        total.value = 0;
    } else {
        total.value = ManagingInfo.value.length;
    }
    store.dispatch('Users', page)
};
//清除查找书本
const cleanbook_name = () => {
    page.value.user_number = "";
    ManagingInfo.value = "";
    Managingaccount.value = "";
    store.dispatch('Users', page)
    getbooktotal();
};
//调用子组件方法删除
const Deletechlid=ref()
const showdeletedialog=(deleteccountinfo)=>{
    Deletechlid.value.showdeletedialog(deleteccountinfo);
}
//调用子组件方法修改
const Modifychild=ref()
const showmodifydialog=(modifyinfo)=>{
    Modifychild.value.adminmodify(modifyinfo);
}
//调用子组件方法增加
const AddAdminchild=ref()
const showAddAdmindialog=()=>{
    AddAdminchild.value.showaddadmin()
}
//成功删除调用
const successdelete=()=>{
    store.dispatch('Users', page)
}
//成功修改调用
const successModify=()=>{
    store.dispatch('Users', page)
}
//成功添加管理员
const successAddAdmin=()=>{
    console.log(1);
    store.dispatch('Users', page)
}
</script>
  
<style scoped>
.Managing_top {
    margin: 20px 30px;
    width: 80%;
    position: absolute;
    display: flex;
    justify-content: space-between;
}

.Managing {
    margin: 80px 20px;
}

.Managing .Managing_page {
    margin-top: 50px;
}

.Managing .Managing_search {
    width: 400px;
    margin: 50px auto;
}

.Managing .Managing_search button {
    margin-left: 10px;
}
</style>
  