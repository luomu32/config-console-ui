import authority from './authority.js'

export default {
    install(Vue) {
        Vue.directive('authority', authority)
    }
}