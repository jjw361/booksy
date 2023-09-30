<template>
  <div class="Notice">
    <el-form :model="Notice" :rules="Noticerules" ref="Noiteform">
      <el-form-item label="标题" style="width: 400px;" prop="title">
        <el-input v-model="Notice.title" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <Editor @keyup="getcontent" ref="children" />
      </el-form-item>
      <el-button class="release" type="success" @click="Announcement">发布</el-button>
    </el-form>
  </div>
</template>

<script setup>
//Message 消息提示
import { ElMessage } from "element-plus";
import Editor from "@/wangEditor/wangEditor.vue";
import { ref } from "vue";
import axios from "axios";
//路由
import { useRouter } from "vue-router";
let $router = useRouter();
const children = ref(null)
const Notice = ref({
  title: '',
  content: ''
})
//公告表单
const Noiteform = ref()
//获取内容
const getcontent = () => {
  Notice.value.content = children.value.getHtml()
}
//发布公告
const Announcement = async () => {
  await Noiteform.value.validate();
  if (Notice.value.content == '') {
    ElMessage({
      type: "error",
      message: "内容不能为空"
    })
  } else {
    try {
      let result = await axios.get("http://localhost/booksy/ReleaseNotice.php", {
        params: {
          Notice_title: Notice.value.title,
          Notice_content: Notice.value.content
        }
      })
      if (result.status == 200) {
        if (result.data == 'yes') {
          ElMessage({
            type: "success",
            message: "发布成功"
          })
          $router.push({ path: "/index" })
        } else {
          ElMessage({
            type: "error",
            message: "发布失败"
          })
        }
      }
    } catch (error) { }
  }
}
//校验标题
const validtitle = (rule, value, callback) => {
  const regtitle = /^.{1,10}$/;
  if (regtitle.test(value)) {
    callback();
  } else if (value == '') {
    callback("标题不能为空");
  } else {
    callback("标题为10个字以下");
  }
};
//校验
const Noticerules = {
  title: [{ validator: validtitle, trigger: "change" }],
};  
</script>

<style scoped>
.Notice {
  margin: 40px;
  display: flex;
  flex-direction: column;
}

.release {
  width: 100px;
  margin: 40px;
}
</style>
