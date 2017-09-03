import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/Pages/Home'
import Contact from '@/Pages/Contact'
import Login from '@/Pages/Login'
import Logout from '@/Pages/Logout'
import Signup from '@/Pages/Signup'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/logout',
      name: 'Logout',
      component: Logout,
      beforeEnter: (to, from, next) => {

      },
      redirect: { name: 'Home' }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    }
  ],
  scrollBehavior: () => { return {x: 0, y: 0} }
})
