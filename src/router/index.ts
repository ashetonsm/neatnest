import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CanvasView from '@/views/CanvasView.vue'
import { authGuard, useAuth0 } from '@auth0/auth0-vue'
import GamesView from '@/views/GamesView.vue'
import GamesList from '@/components/games/GamesList.vue'
import GamesDisplay from '@/components/games/GamesDisplay.vue'
import { userStore } from '@/stores/user'
import { toRaw } from 'vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/callback',
      name: 'callback',
      component: () => import('@/views/CallbackView.vue'),
      beforeEnter: authGuard,
      meta: { requiresAuth: false }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/profile/:username',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      beforeEnter: authGuard,
      meta: { requiresAuth: true }
    },
    {
      path: '/trades',
      name: 'trades',
      component: () => import('@/views/TradesView.vue'),
      beforeEnter: authGuard,
      meta: { requiresAuth: true }
    },
    {
      path: '/friends',
      name: 'friends',
      component: () => import('@/views/FriendsView.vue'),
      beforeEnter: authGuard,
      meta: { requiresAuth: true }
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: () => import('@/views/InventoryView.vue'),
      beforeEnter: authGuard,
      meta: { requiresAuth: true }
    },
    {
      path: '/shop/:id',
      name: 'shop',
      component: () => import('@/views/ShopView.vue'),
      beforeEnter: authGuard,
      meta: { requiresAuth: true }
    },
    {
      path: '/pets',
      name: 'pets',
      component: () => import('@/views/PetsView.vue'),
      beforeEnter: authGuard,
      meta: { requiresAuth: true }
    },
    {
      path: '/canvas/:type',
      name: 'canvas',
      component: CanvasView,
      beforeEnter: authGuard,
      meta: { requiresAuth: true }
    },
    {
      path: '/games',
      name: 'games',
      component: GamesView,
      beforeEnter: authGuard,
      meta: { requiresAuth: true }
    },
    {
      path: '/games',
      name: 'games',
      component: GamesList,
      beforeEnter: authGuard,
      meta: { requiresAuth: true }
    },
    {
      path: '/games/:id',
      name: 'gameDisplay',
      component: GamesDisplay,
      beforeEnter: authGuard,
      meta: { requiresAuth: true }
    },
  ],
})

router.beforeResolve(async to => {
  const { user } = useAuth0();
  const store = userStore()
  const auth0 = useAuth0();
  if (to.meta.requiresAuth && !auth0.isAuthenticated.value) {
    return false
  } else {
    if (user.value && !store.getUser) {
      console.log("Filling logged in user's store value")
      await store.fetchUser(user.value.sub as string, "#METADATA", toRaw(user.value))
      .then(async () => {
        return true
      })
    }
  }
})

export default router
