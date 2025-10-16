import { createRouter, createWebHistory } from 'vue-router'

import home from '../views/HomeView.vue'
import listado_logs from '../views/listado_logs.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/listado_logs',
      name: 'listado_logs',
      component: listado_logs
    }
  ]
})


export default router
