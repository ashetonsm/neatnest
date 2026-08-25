import { createRouter as createVueRouter, createWebHistory, type Router } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CanvasView from '@/views/CanvasView.vue'
import {createAuthGuard } from '@auth0/auth0-vue'
import GamesView from '@/views/GamesView.vue'
import GamesList from '@/components/games/GamesList.vue'
import GamesDisplay from '@/components/games/GamesDisplay.vue'
import type { App } from 'vue'

export default function createRouter(app: App): Router {
  return createVueRouter({
    routes: [
      {
        path: '/',
        name: 'home',
        component: HomeView,
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('@/views/AboutView.vue'),
      },
      {
        path: '/callback',
        name: 'callback',
        component: () => import('@/views/CallbackView.vue'),
        beforeEnter: createAuthGuard(app)
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LoginView.vue'),
      },
      {
        path: '/profile/:username',
        name: 'profile',
        component: () => import('@/views/ProfileView.vue'),
        beforeEnter: createAuthGuard(app)
      },
      {
        path: '/trades',
        name: 'trades',
        component: () => import('@/views/TradesView.vue'),
        beforeEnter: createAuthGuard(app)
      },
      {
        path: '/friends',
        name: 'friends',
        component: () => import('@/views/FriendsView.vue'),
        beforeEnter: createAuthGuard(app)
      },
      {
        path: '/inventory',
        name: 'inventory',
        component: () => import('@/views/InventoryView.vue'),
        beforeEnter: createAuthGuard(app)
      },
      {
        path: '/shop/:id',
        name: 'shop',
        component: () => import('@/views/ShopView.vue'),
        beforeEnter: createAuthGuard(app)
      },
      {
        path: '/pets',
        name: 'pets',
        component: () => import('@/views/PetsView.vue'),
        beforeEnter: createAuthGuard(app)
      },
      {
        path: '/canvas/:type',
        name: 'canvas',
        component: CanvasView,
        beforeEnter: createAuthGuard(app)
      },
      {
        path: '/games',
        name: 'games',
        component: GamesView,
        beforeEnter: createAuthGuard(app)
      },
      {
        path: '/games',
        name: 'games',
        component: GamesList,
        beforeEnter: createAuthGuard(app)
      },
      {
        path: '/games/:id',
        name: 'gameDisplay',
        component: GamesDisplay,
        beforeEnter: createAuthGuard(app)
      },
    ],
    history: createWebHistory('/')
  })
}
