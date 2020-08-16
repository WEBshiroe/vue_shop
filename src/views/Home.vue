<template>
  <el-container class="home-container">
    <!-- 布局头部 -->
    <el-header>
      <span>电商后台管理系统</span>
      <!-- 退出登录按钮 -->
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <!-- 布局侧边栏 -->
      <el-aside :width="isHdie?'65px':'200px'">
        <!-- 折叠区域 -->
        <div class='toggle-button' @click="toggleCollapse">lllll</div>
        <!-- 侧边栏菜单区域 -->
            <el-menu unique-opened background-color="#333744" text-color="#fff" active-text-color="#409BFF" :collapse='isHdie' :collapse-transition='false' router :default-active='activePath'>
              <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                <!-- 一级菜单 -->
                <template slot="title">
                  <i style='margin-right:5px' :class="iconFomat[item.id]"></i>
                  <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                  <el-menu-item :index="childItem.path" v-for="childItem in item.children" :key="childItem.id" @click="saveNavState(childItem.path)">
                    <i class="el-icon-menu"></i>
                    <span>{{childItem.authName}}</span>
                  </el-menu-item>
              </el-submenu>
            </el-menu>
      </el-aside>
      <!-- 布局内容部分 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
        // 初始化侧边栏菜单
        menuList:[],
        // 一级菜单图标
        iconFomat:{
          '125':'iconfont icon-user',
          '103':'iconfont icon-tijikongjian',
          '101':'iconfont icon-shangpin',
          '102':'iconfont icon-danju',
          '145':'iconfont icon-baobiao'
        },
        // 侧边栏显示
        isHdie:false,
        // 被激活的链接地址
        activePath:''
  }},
  created(){
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出登录，清除session并重定向
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取侧边栏菜单
    async getMenuList(){
      let {data:res} = await this.$axios.get('menus')
      if(res.meta.status != 200 ) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 侧边栏隐藏与显示
    toggleCollapse(){
      this.isHdie = !this.isHdie
    },
    // 设置保存二级菜单路径
    saveNavState(data){
      window.sessionStorage.setItem('activePath',data)
    }
  },
};
</script>


<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  height: 40px;
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  span {
    color: #fff;
    font-size: 23px;
  }
}
.el-aside {
  background-color: #333744;
  .toggle-button {
    background-color: #43464e;
    height: 30px;
    cursor: pointer;
    color:#fff;
    text-align: center;
    line-height: 30px;
    letter-spacing: .2em;
    
  }
  .el-menu {
      border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}

</style>