import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import AskOmics from '../views/AskOmics.vue'
import Results from '../views/Results.vue'
import Configuration from '../views/Configuration.vue'
import AskEndpoint from '../views/AskEndpoint.vue'
import AskHashQuery from '../views/AskHashQuery.vue'
import { UserConfiguration } from '@/ts/types'

const routes: Array<RouteRecordRaw> = [
 /* {
    path: '/:endpoint',
    name: 'Ask Endpoint',
    component: Configuration // change to worklows -> configuration -> askomics view
  },
  {
    path: '/:hash_query',
    name: 'Ask Query',
    component: Configuration // change to worklows -> configuration -> askomics view
  },*/
  {
    path: '/',
    name: 'askomics',
    props: true,
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
