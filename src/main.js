import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import 'iview/dist/styles/iview.css'
import iView from 'iview';
// import animated from 'animate.css'
import Http from '@/http.js'
import store from './store/user.js'
import directive from './directives/directive.js'
// import { Layout, Sider, Content, Menu, MenuItem, Table } from "iview";


Vue.config.productionTip = false

Vue.use(iView);
Vue.use(Http)
// Vue.use(animated)

new Vue({
  render: h => h(App),
  store: store,
  router: router
}).$mount('#app')
