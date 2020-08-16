<template>
    <div>
          <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/welcome' }">欢迎页</el-breadcrumb-item>
          <el-breadcrumb-item v-for='item in breadCrumbData' :key='item'>{{item}}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script>
export default {
    data(){
        return{}
    },
    props:['breadCrumbData']
}
</script>