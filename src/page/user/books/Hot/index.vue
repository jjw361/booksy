<template>
  <div class="Hot">
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
      <el-table-column label="图片" width="160" align="center">
        <template template #default="scope">
          <img v-if="scope.row.book_photo" :src="scope.row.book_photo" alt="" style="height: 100px" />
          <span v-else style="color: #7f7f7f;">暂无图片</span>
        </template>
      </el-table-column>
      <el-table-column prop="book_number" width="60" label="数量" align="center" />
      <el-table-column prop="book_more" width="90" label="借阅人数" align="center" >
        <template template #default="scope">
          <svg t="1695037008994" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12640" width="16" height="16"><path d="M641.1 452.3c-89.5-99.5-89.5-218.8-89.5-387.9C273 173.8 342.7 472.2 332.7 571.6c-69.6-59.6-89.5-198.9-89.5-198.9-79.5 39.8-119.3 139.3-119.3 218.8 4.3 205.3 172.6 369.2 377.9 368 204 4.7 373.2-156.9 377.8-360.8 0.1-2.4 0.1-4.8 0.1-7.2 0-119.4-89.5-179-89.5-338.2-90.9 22.1-153.4 105.5-149.1 199z" fill="#FF6B6A" p-id="12641"></path><path d="M491.8 551.7c129.3 49.7 99.5 189 99.5 228.7 20.7-26 34.3-56.8 39.8-89.5 31.5 23.3 50 60.3 49.7 99.5 0 93.4-75.7 169.1-169.1 169.1s-169-75.7-169-169c9.9-89.6 149.1-159.2 149.1-238.8z" fill="#FFA9B1" p-id="12642"></path></svg>
          {{scope.row.book_more}}
        </template>
      </el-table-column>
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
  </div>
</template>

<script setup>
//Message 消息提示
import { ElMessage } from "element-plus";
import { ElNotification } from "element-plus";

import axios from "axios";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
//路由
import { useRoute, useRouter } from "vue-router";
const $router = useRouter();
const $route = useRoute();
const store = useStore();
const bookInfo = ref("1");
// 分页
const page = ref({
  // 第几页
  pageNo: "",
  //一页几条
  pageNumber: "",
});
const loading = ref(false)

onMounted(() => {
  store.dispatch("book", page);
});
//书籍详细
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
.Hot {
  margin: 50px 20px;
}
</style>
