import Vue from 'vue'
import App from './App.vue'
import router from './route.js'
import 'iview/dist/styles/iview.css'
import iView from 'iview';
// import animated from 'animate.css'
import Http from '@/http.js'
// import { Layout, Sider, Content, Menu, MenuItem, Table } from "iview";


Vue.config.productionTip = false

Vue.use(iView);
Vue.use(Http)
// Vue.use(animated)

new Vue({
  render: h => h(App),
  router: router
}).$mount('#app')
