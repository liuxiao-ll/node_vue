import Vue from 'vue'
import Router from 'vue-router'
import goodList from '../components/goodList/goodList'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/goods',
      name: 'goodList',
      component: goodList
    },
    {
      path: '',
      redirect: '/goods'
    }
  ]
})
