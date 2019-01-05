import Vue from 'vue'
import store from '../store/user.js'
import router from '../router.js'

Vue.directive('authority', {
    bind(el, binding) {
        const menuName = router.currentRoute.name
        const actions = store.getters.actionsUnderMenu(menuName)
        const type = binding.value
        if (!actions.some(a => a.type == type)) {
            el.parentNode.removeChild(el)
        }
    }
})