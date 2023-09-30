<template>
  <!-- <input class="qwe"/> -->
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 300px; overflow-y: hidden"
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

export default {
  components: { Editor, Toolbar },
  setup() {
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef();

    // 内容 HTML
    const valueHtml = ref("");

    // 模拟 ajax 异步获取内容
    onMounted(() => {
  
    });
    
    const toolbarConfig = {
    };
    //排除菜单项
    toolbarConfig.excludeKeys = [
      'group-video',
      'fullScreen',
      'codeBlock',
      'todo',
      'emotion',
      'group-image'
      
    ]
    const editorConfig = { 
      
      placeholder: "请输入内容...",
      // MENU_CONF:{
      //   uploadImage:{
      //     server: 'http://localhost/booksy/photo.php',
        
      //   }
      // }
    }
    //获取Html值
    const getHtml=()=>{
    if( valueHtml.value=='<p><br></p>'){
      return ""
    }
      return valueHtml.value
    }
    const setHtml=(a)=>{
      valueHtml.value=a
    }
    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value;
      if (editor == null) return;
      editor.destroy();
    });

    const handleCreated = (editor) => {
      editorRef.value = editor; // 记录 editor 实例，重要！
    };

    

    return {
      editorRef,
      valueHtml,
      mode: "default", // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated,
      getHtml,
      setHtml
    };
  },
};
</script>

<style scoped></style>
