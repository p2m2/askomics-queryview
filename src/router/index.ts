import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import AskOmics from '../views/AskOmics.vue'
import Results from '../views/Results.vue'
import Configuration from '../views/Configuration.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/askomics',
    name: 'AskOmics Query Builder',
    component: AskOmics
  },
  {
    path: '/results',
    name: 'Results',
    component: Results
  },
  {
    path: '/configuration',
    name: 'Configuration',
    component: Configuration
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
