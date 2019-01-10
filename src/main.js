import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import 'iview/dist/styles/iview.css'
import iView from 'iview';
// import animated from 'animate.css'
import http from '@/http.js'
import store from './store/index.js'
import directive from './directive/index.js'
import lang from './lang.js'
// import { Layout, Sider, Content, Menu, MenuItem, Table } from "iview";


Vue.config.productionTip = false

Vue.use(iView);
Vue.use(http)
Vue.use(directive)
// Vue.use(animated)

new Vue({
  render: h => h(App),
  store: store,
  router: router
}).$mount('#app')
