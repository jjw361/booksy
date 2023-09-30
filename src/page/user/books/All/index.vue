<template>
  <!-- 管理员 -->
  <el-button  
  v-if="store.state.identity != '用户' && store.state.identity != ''"
  class="addbook"  type="primary" @click="Addbook">
  添加图书
  </el-button>
  <div class="ALL">
    <!-- 搜索框 -->
    <div class="All_search">
      <el-autocomplete
        v-model="bookname"
        :fetch-suggestions="findbook"
        clearable
        class="inline-input w-50"
        :trigger-on-focus="false"
        placeholder="请输入书籍名字"
        @select="findbook"
      /> 
      <el-button @click="findbook_name" :disabled="!bookname ? true : false"
        >搜索</el-button
      >
      <el-button @click="cleanbook_name">重置</el-button>
    </div>
    <!-- 数据 -->
    <el-scrollbar height="50vh">
      <el-table
        :data="store.state.bookInfo"
        border
        style="width: 100%"
        :row-style="{ height: '80px' }"
        empty-text="暂无图书"
      >
        <el-table-column prop="book_type" label="书籍类型" width="140" align="center" />
        <el-table-column prop="book_name" label="书籍名字" width="200" align="center" />
        <el-table-column prop="book_AuthorName" label="作者" align="center" />
        <el-table-column prop="book_press" label="出版社" align="center" />
        <el-table-column prop="book_isbn" label="ISBN" align="center" width="140" />
        <el-table-column label="图片" width="160"  prop="book_photo" align="center">
        <template #default="scope" >
            <img v-if="scope.row.book_photo" :src="scope.row.book_photo" alt="" style="height: 100px" />
            <span v-else style="color: #7f7f7f;">暂无图片</span>
          </template>
        </el-table-column>
        <el-table-column prop="book_number" width="60" label="数量" align="center" />
        <el-table-column prop="book_more" width="90" label="借阅人数" align="center" />
        <!-- 管理员 -->
      <el-table-column  v-if="store.state.identity != '用户' && store.state.identity != ''" label="操作" align="center" width="180">
        <template #default="scope">
          <el-button color="rgb(222, 226, 227)" @click="EditBook(scope.row.book_id)">
            编辑
          </el-button>
          <el-button color="rgb(143, 171, 180)" @click="DeleteBook(scope.row.book_id)">
            删除
          </el-button>
        </template>
      </el-table-column>
      <!-- 用户 -->
      <el-table-column v-else  label="操作" align="center" width="180">
        <template #default="scope">
          <el-button color="rgb(222, 226, 227)" @click="goDetail(scope.$index)">
            详细
          </el-button>
          <el-button color="rgb(143, 171, 180)" @click="Borrowing(scope.$index)">
            借阅</el-button>
        </template>
      </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 分页 -->
    <div class="ALL_page">
      <el-config-provider :locale="zhCn">
      <el-pagination
        background
        v-model:current-page="page.pageNo"
        v-model:page-size="page.pageNumber"
        :page-sizes="[3, 6, 12, 18]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-config-provider>

    </div>
  </div>
</template>

<script setup>
//中文
import zhCn from 'element-plus/es/locale/lang/zh-cn'
//Message 消息提示
import { ElMessage,ElMessageBox } from "element-plus";
import { ElNotification } from "element-plus";
import axios from "axios";
import qs from "qs";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
const store = useStore();
//路由
import { useRoute, useRouter } from "vue-router";
const $router = useRouter();
const $route = useRoute();
//总页数
const total = ref();
const bookInfo = ref("");
//书本名字
const bookname = ref();
// 分页
const page = ref({
  // 第几页
  pageNo: 1,
  //一页几条
  pageNumber: 3,
  bookname:''
});
onMounted(() => {
  store.dispatch("book", page);
  getbooktotal();
});
//获取书的总数
const getbooktotal = async () => {
  let result = await axios.get("http://localhost/booksy/booktotal.php");
  total.value = result.data;
};
//下拉框变化
const handleSizeChange = (pageNumber) => {
  page.value.pageNumber = pageNumber;
  page.value.bookname = bookname;
  store.dispatch("book", page);
};
//页数
const handleCurrentChange = (pageNo) => {
  page.value.pageNo = pageNo;
  page.value.bookname = bookname;
  store.dispatch("book", page);
};
//储存书本名字
const findbook = async (keyword, cb) => {
  let result = await axios.post(
    "http://localhost/booksy/findbook.php",
    qs.stringify({
      bookname: bookname.value,
    })
  );
  let book_name=[]
  bookInfo.value = result.data;
  if(bookInfo.value!=null){
  // 还书账号去重
  for(let i=0;i<result.data.length;i++){
      if (book_name.indexOf(result.data[i].book_name) === -1){
          book_name.push(result.data[i].book_name)
      }
  }
  }
  let showData = book_name.map((item) => {
    return {
      //书籍名字
      value: item
    };
  });
  cb(showData);
};
//查找书本
const findbook_name = () => {
  page.value.bookname = bookname;
  store.dispatch("book", page);
  if(bookInfo.value==null){
    total.value = 0;
  }else{
    total.value = bookInfo.value.length;

  }
};
//清除查找书本
const cleanbook_name = () => {
  bookInfo.value = "";
  bookname.value = "";
  store.dispatch("book", page);
  getbooktotal();
};
//书本详细
const goDetail = (index) => {
  $router.push({
    path: "HotDetail",
    query: { book_id: store.state.bookInfo[index].book_id },
  });
};
//借书
const Borrowing = async (index) => {
  if (store.state.userLocalCache == "") {
    store.state.showlogin = 1;
  } else {
    let result = await axios.get("http://localhost/booksy/book_borrow.php", {
      params: {
        account: store.state.userLocalCache,
        bookid: store.state.bookInfo[index].book_id,
      },
    });
    if (result.data == "login") {
      ElMessage({
        message: "请先登录",
        type: "error",
      });
      store.state.showlogin = 1;
    } else if (result.data == "yes") {
      ElMessage({
        type: "success",
        message: "借书成功",
      });
      store.dispatch("book", page);
    } else if (result.data == "max5") {
      ElNotification.error({
        message: "每个人最多可借5本书,请先归还~",
        position: "bottom-right",
      });
    } else if (result.data == -1) {
      ElNotification.error({
        message: "图书库存不足",
        position: "bottom-right",
      });
    }
  }
};
// 添加书本
const Addbook=()=>{
  $router.push({path:"/index/AddEditBook"})
}
//编辑
const EditBook=(bookid)=>{
  $router.push({path:"/index/AddEditBook", query: { book_id: bookid },})
}
//删除
const DeleteBook=(bookid)=>{
  ElMessageBox.confirm(
    '你确定要删除吗?',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async() => {
      let result= await axios.post("http://localhost/booksy/deletebook.php", qs.stringify({
        book_id:bookid
      }))
      if(result.data=="yes"){
        ElMessage({
          type: 'success',
          message: '删除成功',
         })
         store.dispatch("book",page);
      }else{
        ElMessage({
          type: 'error',
          message: '删除失败',
         })
      }

    })
}
</script>

<style scoped>
.ALL {
  color: rgb(222, 226, 227);
  margin: 80px 20px;
}
.ALL .ALL_page {
  margin-top: 50px;
}
.ALL .All_search {
  width: 400px;
  margin: 50px auto;
}
.ALL .All_search button {
  margin-left: 10px;
}

.addbook{
  position: absolute;
  top: 20px;
  right: 40px;
}
</style>
