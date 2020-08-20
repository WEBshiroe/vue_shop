import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      // 登录页重定向
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "about" */ '../views/login.vue')
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
      redirect:'/welcome',
      children:[{
        path:'/welcome',
        name:'Welcome',
        component: () => import('../views/Welcome')
      },{
        path:'/users',
        name:'User',
        component: () => import('../views/user/User')
      }
      ,{
        path:'/rights',
        name:'Rights',
        component: () => import('../views/power/Rights.vue')
      },{
        path:'/roles',
        name:'Roles',
        component: () => import('../views/power/Roles.vue')
      }]
    }
]


const router = new VueRouter({
  routes
})

// 路由守卫，没有登录用户无法登录home页面
router.beforeEach((to, from, next)=>{
  if(to.path == '/login') return next()
  // 从本地sessionstroage获取保存的token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr){ return next('/login')
  }else{
    next()
  }
})
export default router
