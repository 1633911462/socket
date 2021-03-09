import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
import axios from 'axios'

Vue.prototype.axios = axios
Vue.use(new VueSocketIO({
  debug:true,
  connection: SocketIO('http://www.chiyu.ink:7555')
}))
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
