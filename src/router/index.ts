import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import AskOmics from '../views/AskOmics.vue'
import Console from '../views/Console.vue'
import Results from '../views/Results.vue'
import Configuration from '../views/Configuration.vue'

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
    path: '/askomics/:rm',
    name: 'askomics',
    component: AskOmics
  },
  {
    path: '/results/:rm',
    name: 'results',
    component: Results
  },
  {
    path: '/console/:rm',
    name: 'console',
    component: Console
  },
  {
    path: '/configuration/:configuration',
    name: 'configuration',
    component: Configuration
  }
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
