import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import GraphBuilder from '../views/GraphBuilder.vue'
import Console from '../views/Console.vue'
import Results from '../views/Results.vue'
import Configuration from '../views/Configuration.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/builder/:rm',
    name: 'builder',
    component: GraphBuilder,
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
    path: '/configuration/:rm',
    name: 'configuration',
    component: Configuration
  }
]


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
