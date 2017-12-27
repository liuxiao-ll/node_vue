// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import VueLazyload from 'vue-lazyload'

Vue.use(VueResource)
Vue.config.productionTip = false

Vue.use(VueLazyload, {
  loading: require('../static/loading-svg/loading-bars.svg')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
