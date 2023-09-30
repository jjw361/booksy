<template>
  <div class="home">
    <div class="home_top">
      <div class="home_top_left" @click="openNotice">
        <span
          ><svg
            t="1693058754550"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4022"
            width="32"
            height="32"
          >
            <path
              d="M958.759003 266.637119c-39.711911-70.914127-96.443213-130.481994-161.684211-173.030471-8.509695-5.67313-14.182825-8.509695-22.692521-8.509695-19.855956 0-34.038781 17.019391-34.038781 36.875346 0 14.182825 5.67313 25.529086 19.855956 34.038781 119.135734 73.750693 192.886427 209.905817 192.886427 354.570637s-73.750693 280.819945-192.886427 354.570638c-8.509695 5.67313-19.855956 17.019391-19.855956 34.038781 0 19.855956 14.182825 36.875346 34.038781 36.875346 8.509695 0 14.182825-2.836565 19.855956-5.67313 68.077562-42.548476 124.808864-102.116343 164.520776-173.030471C998.470914 680.775623 1021.163435 595.67867 1021.163435 510.581717c0-85.096953-22.692521-170.193906-62.404432-243.944598zM833.950139 510.581717c0-51.058172-11.34626-99.279778-36.875347-144.664819-22.692521-42.548476-56.731302-76.587258-96.443213-102.116344 0 0-11.34626-5.67313-19.855956-5.67313-19.855956 0-34.038781 17.019391-34.038781 36.875346 0 14.182825 5.67313 25.529086 17.019391 31.202216 62.404432 36.875346 99.279778 107.789474 99.279778 184.376731s-39.711911 147.501385-104.952909 184.376732c-11.34626 5.67313-17.019391 17.019391-17.01939 31.202216 0 19.855956 14.182825 36.875346 34.038781 36.875346 8.509695 0 17.019391-5.67313 17.019391-5.67313 87.933518-48.221607 141.828255-144.66482 141.828255-246.781164zM547.457064 5.67313c-5.67313-2.836565-11.34626-5.67313-17.019391-5.67313-8.509695 0-19.855956 2.836565-25.529086 8.509695-5.67313 5.67313-59.567867 51.058172-119.135734 96.443214-107.789474 85.096953-138.99169 99.279778-144.66482 102.116343H104.952909 34.038781C14.182825 207.069252 0 224.088643 0 243.944598v536.110804c0 19.855956 14.182825 36.875346 34.038781 36.875346h232.598338c5.67313 2.836565 36.875346 17.019391 130.481995 99.279778 31.202216 28.365651 68.077562 62.404432 104.952908 93.606649l2.836565 2.836565c8.509695 8.509695 17.019391 11.34626 28.365651 11.34626 5.67313 0 11.34626 0 17.019391-2.836565 14.182825-8.509695 25.529086-22.692521 25.529086-39.711911v-181.540167c0-2.836565-2.836565-743.180055-2.836565-751.68975-2.836565-22.692521-11.34626-36.875346-25.529086-42.548477z m-45.385042 782.891967v116.299169c-17.019391-17.019391-34.038781-31.202216-51.058172-45.385042-127.645429-110.626039-161.684211-119.135734-184.376731-119.135734H93.606648c-19.855956 0-25.529086-5.67313-25.529086-28.365651V303.512465c0-17.019391 2.836565-22.692521 17.019391-22.69252h156.01108c22.692521 0 53.894737-8.509695 195.722992-119.135734 22.692521-17.019391 45.385042-34.038781 65.240997-51.058172v677.939058z"
              fill="#666666"
              p-id="4023"
            ></path>
          </svg>
        </span>

        <span v-if="store.state.Notice == '暂无公告'">暂无公告</span>
        <el-text v-else class="Notice_title">{{
          store.state.Notice.notice_title
        }}</el-text>
      </div>
      <div
        class="home_top_right"
        v-if="store.state.identity != '用户' && store.state.identity != ''"
      >
        <el-button type="primary" @click="goNotice">发布公告</el-button>
      </div>

      <!-- 公告 -->
      <el-dialog
        v-model="openNoticevalue"
        center
        :title="store.state.Notice.notice_title"
        width="30%"
      >
        <div v-html="store.state.Notice.notice_content"></div>
        <template #footer> </template>
      </el-dialog>
    </div>
    <div class="home_bottom" v-loading="loading" element-loading-text="等待..." >
      <el-carousel indicator-position="outside" height="500px">
        <el-carousel-item  v-for="item in randombookinfo"   :key="item" @click="gobookinfo(item.book_id)" >
          <el-tooltip
            class="box-item"
            effect="dark"
            content="点击跳转详细"
            placement="top"
          >
            <el-row :gutter="24" >
              <el-col :span="12">
                <div class="home_bottom_left">
                  <img
                    v-if="item.book_photo"
                    :src="item.book_photo"
                    alt=""
                    style="height: 100px"
                  />
                  <span v-else style="color: #7f7f7f">暂无图片</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="home_bottom_right">
                  <div class="home_bottom_right_top">
                    <el-text><h2> {{ item.book_name }}</h2></el-text>
                  </div>
                  <el-divider border-style="dashed" />
                  <div class="home_bottom_right_bottom">
                    <el-scrollbar max-height="400px">
                      <span v-html="item.book_content"></span>
                    </el-scrollbar>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-tooltip>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script setup lang="ts">
import { markRaw, onMounted, ref } from "vue";
//Message 消息提示
import { ElMessage } from "element-plus";
import { useStore } from "vuex";
//路由
import { useRouter } from "vue-router";
let $router = useRouter();
const store = useStore();
const openNoticevalue = ref(false);
import axios from "axios";
import qs from "qs";
onMounted(() => {
  store.dispatch("Notice");
  getrandombookinfo();
  console.log(loading.value);
});
//存储机书籍信息
const randombookinfo = ref();
//随机书籍信息
const getrandombookinfo = async () => {
  let result = await axios.get("http://localhost/booksy/book_rotation.php");
  randombookinfo.value = result.data;
  if (result.data!=null) {
    loading.value=false
  }
  
};
//加载动画
const loading = ref(true)
//公告显示
const openNotice = () => {
  if (store.state.Notice == "暂无公告") {
    ElMessage({
      message: "暂无公告",
    });
  } else {
    store.dispatch("Notice");
    openNoticevalue.value = true;
  }
};
//公告详细
const goNotice = () => {
  $router.push({ path: "/index/Notice" });
};
//书籍详细
const gobookinfo= (book_id) => {
  $router.push({ path: "/index/HotDetail",query: { book_id: book_id }, });
}
</script>

<style scoped>
.home {
  margin: 20px;
}

.home .home_top {
  display: flex;
  width: 100%;
  height: 60px;
  align-items: center;
  justify-content: space-between;
}

.home .home_top .home_top_left {
  display: flex;
  justify-content: center;
  align-items: center;
}

.home .home_top .home_top_left .Notice_title {
  width: 200px;
  cursor: pointer;
  margin-left: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.home .home_top .home_top_left .Notice_title:hover {
  color: rgb(112, 155, 155);
  text-decoration: underline;
}

.home .home_top span {
  margin-left: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.home .home_bottom {
  width: 100%;
  margin-top: 80px;
}
/* 轮播图背景 */
.home_bottomback{
   background-color: rgb(37, 37, 37);
}
.home .home_bottom .home_bottom_left {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 100px 100px;
  height: 100%;
}
.home .home_bottom .home_bottom_left img {
  transform: scale(3);
}
.home .home_bottom .home_bottom_right {
  margin-top: 50px;
  height: 100%;
  margin-right: 100px;
}

.home .home_bottom .home_bottom_right_bottom {
  height: 150px;
}
.home_top_right {
  margin-right: 20px;
}

.addbook {
  position: absolute;
  top: 200px;
  right: 40px;
}
</style>
