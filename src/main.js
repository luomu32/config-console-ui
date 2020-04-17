import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import 'iview/dist/styles/iview.css'
import iView from 'iview';
// import animated from 'animate.css'
import http from '@/http.js'
import store from './store/index.js'
import directive from './directive/index.js'
import locale from './locale/index'
// import { Layout, Sider, Content, Menu, MenuItem, Table } from "iview";


Vue.config.productionTip = false

Vue.use(iView, { i18n: (k, v) => locale.t(k, v) });
Vue.use(http)
Vue.use(directive)
// Vue.use(animated)

new Vue({
  render: h => h(App),
  store: store,
  i18n: locale,
  router: router
}).$mount('#app')
