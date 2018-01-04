import Vue from 'vue'
import Router from 'vue-router'
import goodList from '../components/goodList/goodList'
import cart from '../components/cart/cart'
import address from '../components/address/address'
import orderConfirm from '../components/orderConfrim/orderConfirm'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/good',
      name: 'goodList',
      component: goodList
    },
    {
      path: '',
      redirect: '/good'
    },
    {
      path: '/cart',
      name: 'cart',
      component: cart
    },
    {
      path: '/address',
      name: 'address',
      component: address
    },
    {
      path: '/orderConfirm',
      name: 'orderConfirm',
      component: orderConfirm
    }
  ]
})
