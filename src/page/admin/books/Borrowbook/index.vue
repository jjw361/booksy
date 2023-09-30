<template>
  <div class="Borrow">
    <div class="Borrow_search">
      <el-autocomplete v-model="borrowaccount" :fetch-suggestions="finduserborrowaccount" clearable
        class="inline-input w-50" :trigger-on-focus="false" placeholder="请输入账号" />
      <el-button @click="finduseraccount" :disabled="!borrowaccount ? true : false">搜索</el-button>
      <el-button @click="cleanbook_name">重置</el-button>
    </div>
    <el-scrollbar height="50vh">
      <el-table :data="store.state.borrowbookInfo" border style="width: 100%" :row-style="{ height: '60px' }"
        empty-text="暂无借书记录">
        <el-table-column prop="bookborrow_number" label="账号" width="140" align="center" />
        <el-table-column prop="bookborrow_type" label="书籍类型" align="center" width="120" />
        <el-table-column prop="bookborrow_AuthorName" label="作者" width="160" align="center" />
        <el-table-column prop="bookborrow_press" label="出版社" align="center" width="140" />
        <el-table-column prop="bookborrow_name" label="书籍名字" align="center" />
        <el-table-column prop="bookborrow_isbn" width="140" label="ISBN" align="center" />
        <el-table-column prop="bookborrow_time" sortable width="180" label="借书时间" align="center" />
        <el-table-column label="操作" align="center" width="90">
          <template #default="scope">
            <el-button color="#aec4b7" @click="returbook(scope.row)">还书</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-scrollbar>
    <!-- 分页 -->
    <div class="Borrow_page" v-if="store.state.borrowbookInfo">
      <el-config-provider :locale="zhCn">
        <el-pagination background v-model:current-page="page.pageNo" v-model:page-size="page.pageNumber"
          :page-sizes="[6, 12]" layout="total, sizes, prev, pager, next, jumper" :total="total"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </el-config-provider>
    </div>
  </div>
</template>

<script setup lang="ts">
//Message 消息提示
import { ElMessage } from "element-plus";
//中文
import zhCn from "element-plus/es/locale/lang/zh-cn";
import axios from "axios";
import qs from "qs";
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
const store = useStore();

//总页数
const total = ref();
const BorrowInfo = ref("");
//账号
const borrowaccount = ref();
// 分页
const page = ref({
  // 第几页
  pageNo: 1,
  //一页几条
  pageNumber: 6,
  user_number: "",
});
onMounted(() => {
  store.dispatch("borrowbook", page);
  getbooktotal();
});
//获取书的总数
const getbooktotal = async () => {
  let result = await axios.get("http://localhost/booksy/bookborrowtotal.php", {
    params: { account: store.state.userLocalCache },
  });
  total.value = result.data;
};
//下拉框变化
const handleSizeChange = (pageNumber) => {
  page.value.user_number = borrowaccount;
  page.value.pageNumber = pageNumber;
  store.dispatch("borrowbook", page);
};
//页数
const handleCurrentChange = (pageNo) => {
  page.value.user_number = borrowaccount.value;
  page.value.pageNo = pageNo;
  store.dispatch("borrowbook", page);
};
//储存借书账号
const finduserborrowaccount = async (keyword, cb) => {
  let result = await axios.post(
    "http://localhost/booksy/finduserborrowaccount.php",
    qs.stringify({
      borrowaccount: keyword,
    })
  );
  //存储借书账号
  let borrowaccountarr = [];
  BorrowInfo.value = result.data;
  if (BorrowInfo.value != null) {
    // 借书账号去重
    for (let i = 0; i < result.data.length; i++) {
      if (borrowaccountarr.indexOf(result.data[i].bookborrow_number) === -1) {
        borrowaccountarr.push(result.data[i].bookborrow_number);
      }
    }
  }

  let showData = borrowaccountarr.map((item) => {
    return {
      //借书账号
      value: item
    };
  });
  cb(showData);
};
//查找书本
const finduseraccount = () => {
  page.value.user_number = borrowaccount;
  if (BorrowInfo.value == null) {
    total.value = 0;
  } else {
    total.value = BorrowInfo.value.length;
  }
  store.dispatch("borrowbook", page);
};
//清除查找书本
const cleanbook_name = () => {
  BorrowInfo.value = "";
  borrowaccount.value = "";
  store.dispatch("borrowbook", page);
  getbooktotal();
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
  } else {
    ElMessage({
      type: "error",
      message: "还书失败",
    });
  }
};
</script>

<style scoped>
.Borrow {
  margin: 80px 20px;
}

.Borrow .Borrow_page {
  margin-top: 50px;
}

.Borrow .Borrow_search {
  width: 400px;
  margin: 50px auto;
}

.Borrow .Borrow_search button {
  margin-left: 10px;
}
</style>
