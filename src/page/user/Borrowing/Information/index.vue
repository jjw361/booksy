<template>
  <div class="Information">
    <!-- 借书情况 -->
    <div class="Information_top">
      <h3>借书情况</h3>
      <el-table
        :data="store.state.borrowbookInfo"
        border
        style="width: 100%"
        :row-style="{ height: '60px' }"
        empty-text="暂无借书记录"
      >
        <el-table-column
          prop="bookborrow_number"
          label="账号"
          width="140"
          align="center"
        />
        <el-table-column
          prop="bookborrow_type"
          label="书籍类型"
          align="center"
          width="120"
        />
        <el-table-column
          prop="bookborrow_AuthorName"
          label="作者"
          width="160"
          align="center"
        />
        <el-table-column
          prop="bookborrow_press"
          label="出版社"
          align="center"
          width="140"
        />
        <el-table-column prop="bookborrow_name" label="书籍名字" align="center" />
        <el-table-column prop="bookborrow_isbn" width="140" label="ISBN" align="center" />
        <el-table-column
          prop="bookborrow_time"
          sortable
          width="180"
          label="借书时间"
          align="center"
        />
        <el-table-column label="操作" align="center" width="90">
          <template #default="scope">
            <el-button color="#aec4b7" @click="returbook(scope.row)">还书</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 还书情况 -->
    <div class="Information_bottom">
      <h3>还书情况</h3>
      <el-button class="return" color="rgb(233, 233, 233)" @click="goreturnALlbook"
        >查看更多</el-button
      >
      <el-table
        :data="returnbookInfo"
        border
        style="width: 100%"
        :row-style="{ height: '60px' }"
        empty-text="暂无归还记录"
      >
        <el-table-column
          prop="bookreturn_number"
          label="账号"
          width="140"
          align="center"
        />
        <el-table-column
          prop="bookreturn_type"
          label="书籍类型"
          align="center"
          width="140"
        />
        <el-table-column
          prop="bookreturn_AuthorName"
          label="作者"
          width="180"
          align="center"
        />
        <el-table-column
          prop="bookreturn_press"
          label="出版社"
          align="center"
          width="140"
        />
        <el-table-column prop="bookreturn_name" label="书籍名字" align="center" />
        <el-table-column
          prop="bookreturn_time"
          width="180"
          label="还书时间"
          align="center"
        />
        <el-table-column prop="bookreturn_isbn" width="140" label="ISBN" align="center" />
        <el-table-column label="状态" align="center" width="90">
          <el-button type="success" text="已归还">已归还</el-button>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
//Message 消息提示
import { ElMessage } from "element-plus";
import axios from "axios";
import qs from "qs";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
const store = useStore();
const returnbookInfo = ref();
//路由
import { useRouter } from "vue-router";
const $router = useRouter();
//分页
const page = ref({
  // 第几页
  pageNo: "",
  //一页几条
  pageNumber: "",
  user_number: "",
});
onMounted(() => {
  //借书记录
  store.dispatch("borrowbook", page);
  getreturnbook();
});
//获取还书情况
const getreturnbook = async () => {
  let result = await axios.post(
    "http://localhost/booksy/returnbook.php",
    qs.stringify({
      account: store.state.userLocalCache,
    })
  );
  if (result.status == 200) {
    returnbookInfo.value = result.data;
  }
};
//跳转全部还书情况
const goreturnALlbook = () => {
  $router.push({ path: "History" });
};
//还书
const returbook = async (bookinfo) => {
  let result = await axios.get("http://localhost/booksy/book_return.php", {
    params: {
      account: store.state.userLocalCache,
      user_number: bookinfo.bookborrow_number,
      returnbookid: bookinfo.bookborrow_id,
    },
  });
  if (result.data == "yes") {
    ElMessage({
      type: "success",
      message: "还书成功",
    });
    store.dispatch("borrowbook",page);
    getreturnbook();
  } else {
    ElMessage({
      type: "error",
      message: "还书失败",
    });
  }
};
</script>

<style scoped>
.Information {
  display: flex;
  flex-direction: column;
  margin: 40px;
  height: 650px;
}
.Information .Information_top {
  flex: 2;
  width: 100%;
}
.Information .Information_top h3 {
  text-align: center;
  margin: 10px;
}
.Information .Information_bottom {
  flex: 1;
  width: 100%;
}
.Information .Information_bottom h3 {
  text-align: center;
}
.return {
  float: right;
  margin-bottom: 20px;
}
</style>
