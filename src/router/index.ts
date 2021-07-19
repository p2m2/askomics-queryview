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
    path: '/askomics/:query',
    name: 'askomics',
    component: AskOmics
  },
  {
    path: '/results/:rm',
    name: 'results',
    component: Results
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
