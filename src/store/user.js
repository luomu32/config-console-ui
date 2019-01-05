import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

const User = new Vuex.Store({
    state: {
        user: {
            // expireAt: "",
            id: "",
            username: "",
            roleId: "",
            roleName: "",
            menus: [],
            actions: []
        }
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
        actions: (state, getters) => {
            if (!getters.user.actions)
                return []
            // return ALL_MENUS.filter(m => getters.user.menus.indexOf(m.name) != -1)
            return getters.user.actions
        },
        actionsUnderMenu: (state, getters) => (menuName) => {
            if (getters.menus.length == 0)
                return []
            const menus = getters.menus.filter(m => m.name == menuName)
            if (menus.length == 0)
                return []
            return getters.actions.filter(m => m.menuId == menus[0].id)
        },
        menus: (state, getters) => {
            const menus = getters.user.menus
            if (!menus)
                return []
            return menus
        }
    },
    mutations: {
        set(state, user) {
            state.user.id = user.id
            state.user.username = user.username
            state.user.roleId = user.roleId
            state.user.roleName = user.roleName
            // state.user.expireAt = user.expireAt
            state.user.menus = user.menus
            state.user.actions = user.actions
            try {
                sessionStorage.setItem("user", JSON.stringify(state.user))
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
            state.user.menus = []
            state.user.actions = []
            try {
                sessionStorage.removeItem("user")
            } catch (e) {
                //
            }
        }
    }, actions: {

    }
})

export default User