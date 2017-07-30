import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Header from '@/components/header'
import World from '@/components/world'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Header',
      component: Header
    },
    {
      path: '/hello',
      name: 'hello',
      component: Hello
    },
    {
      path: '/world',
      name: 'world',
      component: World
    },
  ]
})
