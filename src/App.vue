<template>
  <Top/>
  <router-view/>
  <Login/>
  <Register/>
</template>

<script setup> 
//Message 消息提示
import { ElMessage } from "element-plus";
//localStorage
import LocalCache from "@/cache.ts";
import {useStore} from 'vuex'
const store=useStore()
import axios from 'axios';
import { onMounted,watch } from 'vue';
</script>

<style scoped>

</style>
