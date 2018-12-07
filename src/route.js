import vue from 'vue'
import VueRouter from 'vue-router'
import Cookies from 'js-cookie'
import http from '@/http'
// import Config from './components/Config.vue'
// import ConfigEdit from './components/EditConfig.vue'
import Server from './components/Server.vue'

vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: "/", name: "home", component: () => import("./components/Layout.vue"), children: [
                { path: 'server', name: 'server', component: Server },
                { path: "config", name: "config", component: () => import("./components/Config.vue") },
                { path: "log", name: "log", component: () => import("./components/Log.vue") },
                {
                    path: 'user', name: "user", component: () => import("./components/User.vue")
                },
                {
                    path: "user/:id/application", name: "userApplication", component: () => import("./components/UserApplication.vue")
                }
                , {
                    path: "role", name: "role", component: () => import("./components/Role.vue")
                }, {
                    path: "application", name: "application", component: () => import("./components/Application.vue")
                }
            ]
        },
        // { path: '/config/:id', name: 'config', component: () => import('./components/ServerConfig.vue') },
        // { path: '/:serverId/application', name: 'application', component: () => import('./components/Application.vue') },
        { path: '/login', name: "login", component: () => import('./components/Login.vue') },
        { path: "*", name: '404', component: () => import('./components/404.vue') },
    ]
})

router.beforeEach((to, from, next) => {
    const targetMenuName = to.name
    if (targetMenuName === "login" || targetMenuName === "404") {
        next()
        return
    }
    //如果登录凭证cookie不存在，
    var token = Cookies.get("token");
    if (!token)
        next({ name: "login" })
    else
        next()
    // else {
    //     //根据用户的菜单权限，判断是否有权跳转到对应的页面
    //     http.get('/role/menus').then(resp => {
    //         resp.data.indexOf(targetMenuName)
    //         // if (resp.data) {
    //         // next({ replace: true, name: "401" })
    //         // }
    //         // else next()
    //         next()
    //     })
    // }

})

export default router