import { createRouter, createWebHistory } from 'vue-router'
import App from '../App.vue'
import SearchResults from '../views/SearchResults.vue'
import About from '../views/About.vue'

const routes = [
  {
    path: '/',
    component: App,
    children: [
      {
        path: '/settings',
        component: () => import('../views/Settings.vue')
      }
    ]
  },
  {
    path: '/search',
    component: SearchResults
  },
  {
    path: '/about',
    component: About
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
