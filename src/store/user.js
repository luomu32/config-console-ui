export default {
    namespaced: true,
    state: {
        user: {
            // expireAt: "",
            id: "",
            username: "",
            roleId: "",
            roleName: ""
        },
        menus: "",
        actions: ""
    },
    getters: {
        user: state => {
            if (state.user && state.user.id) {
                return state.user
            }
            try {
                return JSON.parse(sessionStorage.getItem('user'))
            } catch (e) {
                return state.user
            }
        },
        actions: (state) => {
            if (state.actions)
                return state.actions
            try {
                return JSON.parse(sessionStorage.getItem('actions'))
            } catch (e) {
                return []
            }
        },
        actionsUnderMenu: (state, getters) => (menuName) => {
            if (getters.menus.length == 0)
                return []
            const menus = getters.menus.filter(m => m.name == menuName)
            if (menus.length == 0)
                return []
            return getters.actions.filter(m => m.menuId == menus[0].id)
        },
        menus: (state) => {
            if (state.menus)
                return state.menus
            try {
                return JSON.parse(sessionStorage.getItem('menus'))
            } catch (e) {
                return []
            }
        }
    },
    mutations: {
        set(state, user) {
            state.user.id = user.id
            state.user.username = user.username
            state.user.roleId = user.roleId
            state.user.roleName = user.roleName
            // state.user.expireAt = user.expireAt
            state.menus = user.permission.menus
            state.actions = user.permission.actions
            try {
                sessionStorage.setItem("user", JSON.stringify(state.user))
                sessionStorage.setItem("menus", JSON.stringify(state.menus))
                sessionStorage.setItem("actions", JSON.stringify(state.actions))
            } catch (e) {
                //
            }
        },
        updatePermission(state, permission) {
            state.menus = permission.menus
            state.actions = permission.actions
            try {
                sessionStorage.setItem("menus", JSON.stringify(state.menus))
                sessionStorage.setItem("actions", JSON.stringify(state.actions))
            } catch (e) {
                //
            }
        },
        clear(state) {
            state.user.id = ""
            state.user.username = ""
            state.user.roleId = ""
            state.user.roleName = ""
            // state.user.expireAt = ""
            state.menus = ""
            state.actions = ""
            try {
                sessionStorage.removeItem("user")
                sessionStorage.removeItem("menus")
                sessionStorage.removeItem("actions")
            } catch (e) {
                //
            }
        }
    }, actions: {
        login({ state, commit, rootState }) {

            // commit('set')
        }
    }
}
