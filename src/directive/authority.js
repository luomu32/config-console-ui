import store from '../store/index.js'
import router from '../router.js'

export default {
    bind(el, binding) {
        const menuName = router.currentRoute.name
        const actions = store.getters['user/actionsUnderMenu'](menuName)
        const type = binding.value
        if (!actions.some(a => a.type == type)) {
            el.parentNode.removeChild(el)
        }
    }
}