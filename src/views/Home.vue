<template>
    <div>
        <!-- 退出登录按钮 -->
        <el-button type="info" @click="logout">退出登录</el-button>
    </div>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    methods:{
        logout(){
            window.sessionStorage.clear()
            this.$router.push('/login')
        }       
    }
}
</script>