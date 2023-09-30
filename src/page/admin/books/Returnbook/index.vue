<template>
    <div class="Returnbook">
    <div class="Returnbook_search">
      <el-autocomplete
        v-model="returnaccount"
        :fetch-suggestions="finduseraccount"
        clearable
        class="inline-input w-50"
        :trigger-on-focus="false"
        placeholder="请输入账号"
      />
      <el-button @click="finduseraccount_name" :disabled="!returnaccount ? true : false"
        >搜索</el-button
      >
      <el-button @click="cleanbook_name">重置</el-button>
    </div>
    <el-scrollbar height="50vh">
    <el-table 
      :data="store.state.bookreturnkInfo" 
      border style="width: 100%" 
      :row-style="{height: '60px'}"
      empty-text="暂无归还记录"
      >
      <el-table-column prop="bookreturn_number" label="账号" width="140" align="center" />
      <el-table-column prop="bookreturn_type" label="书籍类型" align="center" width="140"  />
      <el-table-column prop="bookreturn_AuthorName" label="作者" width="180" align="center" />
      <el-table-column prop="bookreturn_press" label="出版社" align="center" width="140" />
      <el-table-column prop="bookreturn_name" label="书籍名字" align="center"/>
      <el-table-column prop="bookreturn_isbn" width="140" label="ISBN" align="center" />
      <el-table-column prop="bookreturn_time"  sortable width="180" label="还书时间" align="center" />
      <el-table-column label="状态" align="center" width="100">
          <el-button type='success' text='已归还'>已归还</el-button>
      </el-table-column>
    </el-table>
    </el-scrollbar>	
    <!-- 分页 -->
    <div class="Returnbook_page" v-if="store.state.bookreturnkInfo">
      <el-config-provider :locale="zhCn">
      <el-pagination
        background
        v-model:current-page="page.pageNo"
        v-model:page-size="page.pageNumber"
        :page-sizes="[6, 12]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-config-provider>
    </div>
  </div>
</template>

<script setup lang="ts">    
//中文
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import axios from "axios";
import qs from "qs";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
const store = useStore();

//总页数
const total = ref();
const returnbookInfo = ref("");
//账号
const returnaccount = ref();
// 分页
const page = ref({
  // 第几页
  pageNo: 1,
  //一页几条
  pageNumber: 6,
  user_number:''

});
onMounted(() => {
  store.dispatch("returnbook", page);
  getbooktotal();
});
//获取书的总数
const getbooktotal =  async() => {
  let result = await axios.get("http://localhost/booksy/bookreturntotal.php",{params:{account:store.state.userLocalCache}});
  total.value = result.data;

};
//下拉框变化
const handleSizeChange = (pageNumber) => {
  page.value.user_number = returnaccount;
  page.value.pageNumber = pageNumber;
  store.dispatch("returnbook", page);
};
//页数
const handleCurrentChange = (pageNo) => {
    page.value.user_number = returnaccount.value;
  page.value.pageNo = pageNo;
  store.dispatch("returnbook", page);
};

//储存还书账号
const finduseraccount = async (keyword, cb) => {
  let result = await axios.post(
    "http://localhost/booksy/finduserreturnaccount.php",
    qs.stringify({
        returnaccount: keyword,
    })
  );
  //存储还书账号
  
  let returnbookaccountarr=[]
  returnbookInfo.value = result.data;
  if(returnbookInfo.value!=null){
    // 还书账号去重
  for(let i=0;i<result.data.length;i++){
      if (returnbookaccountarr.indexOf(result.data[i].bookreturn_number) === -1){
            returnbookaccountarr.push(result.data[i].bookreturn_number)
      }
  }
  }
  let showData = returnbookaccountarr.map((item) => {
    return {
      //还书账号
      value: item,
    };
  });
  cb(showData);
};
//查找书本
const finduseraccount_name = () => {
    page.value.user_number = returnaccount;
    if(returnbookInfo.value==null){
    total.value = 0;
  }else{
    total.value = returnbookInfo.value.length;
  }
    store.dispatch("returnbook", page);
};
//清除查找书本
const cleanbook_name = () => {
  returnbookInfo.value = "";
  returnaccount.value = "";
  store.dispatch("returnbook", page);
  getbooktotal();
};
</script>

<style scoped>
.Returnbook {
  margin: 80px 20px;
}
.Returnbook .Returnbook_page {
  margin-top: 50px;
}
.Returnbook .Returnbook_search {
  width: 400px;
  margin: 50px auto;
}
.Returnbook .Returnbook_search button {
  margin-left: 10px;
}
</style>