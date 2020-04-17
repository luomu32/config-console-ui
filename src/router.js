import vue from 'vue'
import VueRouter from 'vue-router'
import store from './store/index.js'

vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: "/", name: "home", component: () => import("./views/Layout.vue"), children: [
                { path: 'server', name: 'server', component: () => import("./views/Server.vue") },
                { path: "config", name: "config", component: () => import("./views/config/Config.vue") },
                { path: "log", name: "log", component: () => import("./views/Log.vue") },
                {
                    path: 'user', name: "user", component: () => import("./views/user/User.vue")
                },
                {
                    path: "user/:id/application", name: "userApplication", component: () => import("./views/UserApplication.vue")
                }
                , {
                    path: "role", name: "role", component: () => import("./views/Role.vue")
                }, 
                // {
                //     path: "application", name: "application", component: () => import("./views/application/Application.vue")
                // }, 
                {
                    path: "application/create", name: "application-add", component: () => import("./views/application/Create.vue")
                }, {
                    path: "application/manage", name: "application-query", component: () => import("./views/application/Manage.vue")
                }
            ]
        },
        // { path: '/config/:id', name: 'config', component: () => import('./components/ServerConfig.vue') },
        // { path: '/:serverId/application', name: 'application', component: () => import('./components/Application.vue') },
        { path: '/login', name: "login", component: () => import('./views/Login.vue') },
        { path: '/403', name: "403", component: () => import('./views/error/403.vue') },
        { path: "*", name: '404', component: () => import('./views/error/404.vue') },
    ]
})

router.beforeEach((to, from, next) => {
    const targetMenuName = to.name
    if (targetMenuName === "login" || targetMenuName === "404" || targetMenuName === "403") {
        next()
        return
    }

    const user = store.getters['user/user']
    const menus = store.getters['user/menus']
    // console.log(user)
    if (!user || !user.id)
        next({ name: "login", replace: true })
    else if (targetMenuName == 'home')
        next()
    //根据用户的菜单权限，判断是否有权跳转到对应的页面
    else if (!menus || !menuPermissionCheck(menus, targetMenuName)) {
        //比较当前日期与user中的过期日期，过期了跳转到登录页
        //有问题，过期策略应当是用户无操作30分钟才过期，如果有操作就会延迟过期，而不是一个固定的过期时间
        // const expireAt = new Date(user.expireAt)
        // const now = new Date()
        // if (now > expireAt) {
        //     console.log(`user expire at ${expireAt}`)
        //     //clear 
        //     store.commit("clear")
        //     next({ name: "login" })
        //     return
        // }
        // console.log('missing menus')
        next({ name: "403" })
        return
    } else
        next()
})

const menuPermissionCheck = (menus, targetMenuName) => {
    const result = menus.some(element => {
        if (element.children.length != 0)
            return menuPermissionCheck(element.children, targetMenuName)

        // console.log(`${element.name}=${targetMenuName}`)
        if (element.name == targetMenuName) {
            // console.log(`${element.name}`)
            return true
        }
    });
    if (result) {
        return true
    }
    return false
}

export default router