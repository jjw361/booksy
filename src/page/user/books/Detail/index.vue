<template>
    <el-button class="return" color="rgb(223, 223, 223)" :icon="ArrowLeft" @click="returnALlbook">返回</el-button>
    <div class="Detail" v-for="item in bookdetail">
        <div class="Detail_top">
            <div class="Detail_top_left">
                <table>
				<tr>
					<td><el-text>ID:</el-text></td>
					<td><el-text>{{ item.book_id }}</el-text></td>
					<td><el-text>数量:</el-text></td>
					<td><el-text>{{ item.book_number }}</el-text></td>
				</tr>
				<tr>
					<td><el-text>书籍类型:</el-text></td>
					<td><el-text>{{ item.book_type }}</el-text></td>
					<td><el-text>作者:</el-text></td>
					<td><el-text>{{ item.book_AuthorName }}</el-text></td>
				</tr>
				<tr>
					<td><el-text>书籍名字:</el-text></td>
					<td><el-text>{{item.book_name }}</el-text></td>
					<td><el-text>出版社:</el-text></td>
					<td><el-text>{{ item.book_press }}</el-text></td>
				</tr>
				<tr>
					<td><el-text>ISBN:</el-text></td>
					<td colspan="4"><el-text>{{ item.book_isbn }}</el-text></td>
				</tr>
			</table>
            </div>
            <div class="Detail_top_right">
                <img v-if="item.book_photo" :src="item.book_photo" alt="" style="height: 100px" />
                <span v-else style="color: #7f7f7f;">暂无图片</span>
            </div>
        </div>
        <el-divider border-style="dashed" />
        <div class="Detail_bottom">
            <el-text><p style="font-size:24px;text-align: center;">书籍简介</p></el-text>
            <el-scrollbar height="250px">
                
            <div class="scrollbar-demo-item" v-html="item.book_content"> 
			</div>
        </el-scrollbar>	
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
//路由
import { useRoute,useRouter } from "vue-router"
const $router=useRouter();
const $route=useRoute();
//图标
import { ArrowLeft } from '@element-plus/icons-vue'
import axios from "axios";
import qs from "qs";
const bookdetail=ref()
onMounted(() => {
    getbookdetail()
})
const getbookdetail=async()=>{
  let result = await axios.post("http://localhost/booksy/getbookdetail.php", qs.stringify({
            bookid:$route.query.book_id}))
    if(result.status==200){
        bookdetail.value=result.data
    }
    
}
const returnALlbook=()=>{
    $router.go(-1)
}   
</script>

<style scoped>
.Detail{
    margin: 40px;
    
}
.Detail .Detail_top{
    display: flex;
    height: 300px;
}
.Detail .Detail_top .Detail_top_left{
    margin-right: 10px;
    flex: 1;
}
.Detail .Detail_top .Detail_top_right{
    margin-left: 10px;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}
.Detail .Detail_top .Detail_top_right img{
    transform: scale(2.5);
}
.Detail_bottom{
    width: 100%;
    height: 50%;
}
.scrollbar-demo-item {
  display: flex;
  justify-content: center;
  height: 100%;
  margin: 20px;
  text-align: center;
}
table{
    margin-top: 20px;
    width: 100%;
    border-collapse:collapse;
    text-align: center;
}
td{
    border:1px solid lightgray;
    height:70px;
    width: 50px;
    padding-left: 10px;
}
.return{
    margin-top: 20px;
    margin-left: 40px;
}
</style>