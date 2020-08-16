<template>
<!-- 登录页 -->
    <div class="login_container">
       <!-- 登录框 -->
       <div class='login_box'>
           <!-- 登录框logo -->
           <div class='login-img'>
               <img src="../assets/logo.png" alt="">
           </div>
           <!--  输入框 -->
           <el-form ref='loginFormRef' :rules="loginFormRules" :model="loginForm" label-width="0" class='login_form'>
               <!-- 用户框 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-users"></el-input>
                </el-form-item>
                <!-- 密码框 -->
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type='password'></el-input>
                </el-form-item>
                <el-form-item class='btns'>
                    <el-button type="primary" @click='login'>登录</el-button>
                    <el-button type="info" @click='resetLoginForm'>重置</el-button>
                </el-form-item>
           </el-form>
       </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data(){
        return{
            // 登录表单的数据绑定对象
            loginForm:{
                username:'admin',
                password:'123456'
            },
            // 表单验证
            loginFormRules:{
                 username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                password:[
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        // 表单登录重置
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields()
        },

        login(){
            // 登录预校验
            this.$refs.loginFormRef.validate(async valid=>{
                // 不发起请求
                if(!valid) return
                // 发起请求
                const {data: res} = await this.$axios.post('login',this.loginForm)
                if(res.meta.status !== 200) return this.$message.error('登录失败')
                this.$message({
                    message: '恭喜你，登录成功',
                    type: 'success'
                })
                // 设置window sessionStorage，保存登录信息
                window.sessionStorage.setItem('token',res.data.token)
                // 登录成功跳转页面
                this.$router.push('/home')
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .login_container {
        width: 100%;
        height: 100%;
        background-color: #2b4b6b;
        position: relative
    }
    .login_box {
        background-color: #fff;
        width: 450px;
        height: 300px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        border-radius: 3px;
    }
    .login-img {
        width: 140px;
        height: 140px;
        border: 1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #eee;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #fff;
        img {
            height: 100%;
            width: 100%;
            border-radius: 50%;
            border: 1px solid #eee;
            background-color: #eee;
        }
    }
    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
    .btns {
        display: flex;
        justify-content: flex-end;
    }
</style>