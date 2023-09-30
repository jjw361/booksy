<template>
    <el-scrollbar height="80vh">
        <div class="AddBook">
            <el-form
            ref="addeditbookform"
            :model="addeditbookinfo" 
            label-width="100px" 
            class="demo-form-inline " 
            label-position='right'
            :rules="AddBookrules"
            >
                <!-- 书籍名字 -->
                <el-col :span="6">
                    <el-form-item label="书籍名字:" prop="book_name">
                        <el-input v-model="addeditbookinfo.book_name" clearable />
                    </el-form-item>
                </el-col>
                <!-- 书籍类型 -->
                <el-col :span="6">
                    <el-form-item label="书籍类型:" prop="book_type">
                        <el-input v-model="addeditbookinfo.book_type" clearable />
                    </el-form-item>
                </el-col>
                <!-- 作者名字 -->
                <el-col :span="6">
                    <el-form-item label="作者名字:" prop="book_AuthorName">
                        <el-input v-model="addeditbookinfo.book_AuthorName" clearable />
                    </el-form-item>
                </el-col>
                <!-- 数量 -->
                <el-col :span="6">
                    <el-form-item label="数量:" prop="book_number">
                        <el-input v-model="addeditbookinfo.book_number" clearable />
                    </el-form-item>
                </el-col>
                <!-- 出版社 -->
                <el-col :span="6"  >
                    <el-form-item label="出版社:" prop="book_press">
                        <el-input v-model="addeditbookinfo.book_press" clearable />
                    </el-form-item>
                </el-col>
                <!-- ISBN -->
                <el-col :span="6" >
                    <el-form-item label="ISBN:" prop="book_isbn">
                        <el-input v-model="addeditbookinfo.book_isbn" clearable />
                    </el-form-item>
                </el-col>
                <!-- 图片上传 -->
                <el-col :span="20">
                    <el-form-item label="书籍图片:">
                        <!-- 
                            上传成功:on-success
                            删除:on-remove  
                            超出限制:on-exceed
                            数量限制:limit
                            放大:on-preview
                        -->
                        <el-upload
                            ref="upload"
                            :limit="1"
                            :on-success="handlesuccess"
                            :on-exceed="handleExceed"
                            action="http://localhost/booksy/photo.php" list-type="picture-card"
                            :on-preview="handlePictureCardPreview" 
                            :on-remove="handleRemove"
                            >
                            <el-icon><Plus /></el-icon>
                        </el-upload>

                        <el-dialog  v-model="dialogVisible">
                            <img w-full style="width: 100%;height: 100%;" :src="dialogImageUrl" alt="Preview Image" />
                        </el-dialog>
                    </el-form-item>
                </el-col>
                <!-- 书籍介绍 -->
                <el-col :span="24" >
                    <el-form-item label="书籍介绍:">
                        <Editor @keyup="getcontent" ref="children" />
                    </el-form-item>
                </el-col>
                <!-- 提交，重置 -->
                <el-form-item>
                    <el-button v-if="$route.query.book_id==undefined" type="success" style="width: 100px;" @click="AddBook">添加</el-button>
                    <el-button v-else type="success" style="width: 100px;" @click="EditBook">修改</el-button>
                    <el-button type="warning" style="width: 100px;" @click="resetting">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-scrollbar>
</template>

<script setup lang="ts">
//路由
import { useRouter,useRoute } from "vue-router";
let $router = useRouter();
let $route = useRoute();
//消息提醒
import { ElMessage,genFileId } from 'element-plus'
import { ref,onMounted } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import axios from "axios";
import qs from "qs";

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
//书本数据
const addeditbookinfo = reactive({
    book_name: '',
    book_AuthorName: '',
    book_number: '',
    book_photo: '',
    book_type: '',
    book_press: '',
    book_isbn: '',
    book_content: ''
})
//表单
const addeditbookform=ref()
const bookcontent=ref()
onMounted(() => {
    getbookcontent()
});

//获取书籍信息
const getbookcontent=async()=>{
    if($route.query.book_id!=undefined){
        let result = await axios.post("http://localhost/booksy/getbookdetail.php", qs.stringify({
            bookid:$route.query.book_id}))
        if(result.status==200){
            bookcontent.value=result.data
            addeditbookinfo.book_name=bookcontent.value[0]["book_name"]
            addeditbookinfo.book_AuthorName=bookcontent.value[0]["book_AuthorName"]
            addeditbookinfo.book_number=bookcontent.value[0]["book_number"]
            addeditbookinfo.book_photo=bookcontent.value[0]["book_photo"]
            addeditbookinfo.book_type=bookcontent.value[0]["book_type"]
            addeditbookinfo.book_press=bookcontent.value[0]["book_press"]
            addeditbookinfo.book_isbn=bookcontent.value[0]["book_isbn"]
            addeditbookinfo.book_content=bookcontent.value[0]["book_content"]
            children.value.setHtml(addeditbookinfo.book_content)
        }
    }
 
}
//删除图片
const handleRemove = async(uploadFile, uploadFiles) => {
    await axios.post("http://localhost/booksy/deletephoto.php", qs.stringify({
            photoname:uploadFile.response.data.name
    }))
}
//上传成功
const handlesuccess=(response, uploadFile, uploadFiles)=>{
    addeditbookinfo.book_photo=response.data.url
    ElMessage({
        message: '上传成功',
        type: 'success',
    })
    
}
//放大
const handlePictureCardPreview = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
//超出限制
const upload = ref()
const handleExceed = (files) => {
  upload.value!.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value!.handleStart(file)
}
//编辑器
import Editor from "@/wangEditor/wangEditor.vue";
const children = ref(null)
//获取编辑器内容
const getcontent = () => {
    addeditbookinfo.book_content = children.value.getHtml()
}
import { reactive } from 'vue'

//添加书籍
const AddBook =async () => {
    await addeditbookform.value.validate();
    try {
        if (addeditbookinfo.book_content == '') {
        ElMessage({
        type: "error",
        message: "书籍介绍不能为空"
        })
    }else{
    let result= await axios.post("http://localhost/booksy/addbook.php", qs.stringify({
        bookinfo:addeditbookinfo
    }))
    if(result.data=="yes"){
        ElMessage({
            type:'success',
            message:'添加成功'
        })
        $router.go(-1)
    }else{
        ElMessage({
            type:'error',
            message:'添加失败'
        })
    }
  }
    }catch(error){}
}
//修改书籍
const EditBook=async()=>{
    await addeditbookform.value.validate();
    if (addeditbookinfo.book_content == '') {
        ElMessage({
        type: "error",
        message: "请输入书籍介绍"
        })
    }else{
    let result= await axios.post("http://localhost/booksy/editbook.php", qs.stringify({
        bookinfo:addeditbookinfo,
        book_id:$route.query.book_id
    }))
    if(result.data=="yes"){
        ElMessage({
            type:'success',
            message:'修改成功'
        })
        $router.go(-1)
    }else{
        ElMessage({
            type:'error',
            message:'修改失败'
        })
    }
  }
}
//重置
const resetting=()=>{
    upload.value.clearFiles(),
    addeditbookform.value.resetFields()
    addeditbookinfo.book_name=""
    addeditbookinfo.book_AuthorName=""
    addeditbookinfo.book_number=""
    addeditbookinfo.book_photo=""
    addeditbookinfo.book_type=""
    addeditbookinfo.book_press=""
    addeditbookinfo.book_isbn=""
    addeditbookinfo.book_content=""
}
//校验书籍名字
const validbook_name = (rule, value, callback) => {
    if(!value){
    callback("请输入书籍名字");
  }else{
    callback();
  }
};
//校验作者名字
const validbook_AuthorName = (rule, value, callback) => {
  if(!value){
    callback("请输入作者名字");
  }else{
    callback();
  }
};
//校验书籍数量
const validbook_number = (rule, value, callback) => {
  const regbook_number = /^[1-9]\d*$/;
  if(!regbook_number.test(value)){
    callback("请输入大于0的数字");
  }else{
    callback();
  }
};
//校验书籍类型
const validbook_type = (rule, value, callback) => {
  const regbook_type = /^[\u4E00-\u9FA5]{1,50}$/;
  if(!value){
    callback("请输入书籍类型")
  }else if(!regbook_type.test(value)){
    callback("请输入中文");
  }else{
    callback();
  }
};
//校验书籍出版社
const validbook_press = (rule, value, callback) => {
    const regbook_press=/^[\u4E00-\u9FA5]{1,50}$/
    if(!value){
        callback("请输入出版社")
    }else if(!regbook_press.test(value)){
        callback("请输入正确的出版社")
    }else{
        callback();
    }
};
//校验书籍isbn
const validbook_isbn = (rule, value, callback) => {
    const regbook_isbn = /^978[\d]{10}|ISBN[\d]{13}$/;
    if(!value){
        callback("请输入ISBN");
    }else if(!regbook_isbn.test(value)){
        callback("请输入正确的ISBN");
    }else{
        callback();
    }
};
//校验
const AddBookrules = {
  book_name: [{ validator: validbook_name, trigger: "change" , required: true,}],
  book_AuthorName: [{ validator: validbook_AuthorName, trigger: "change" , required: true,}],
  book_number: [{ validator: validbook_number, trigger: "change" , required: true,}],
  book_type: [{ validator: validbook_type, trigger: "change" , required: true,}],
  book_press: [{ validator: validbook_press, trigger: "change" , required: true,}],
  book_isbn: [{ validator: validbook_isbn, trigger: "change" , required: true,}],
}; 
</script>

<style scoped>
.AddBook {
    margin: 50px;
}
</style>