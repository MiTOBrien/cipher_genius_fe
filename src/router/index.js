import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LandingView from '@/views/LandingView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegistrationView.vue'),
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/atbash',
      name: 'atbash',
      component: () => import('../views/AtbashView.vue'),
    },
    {
      path: '/caesar',
      name: 'caesar',
      component: () => import('../views/CaesarView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue'),
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: ResetPasswordView,
      // component: () => import('../views/ResetPasswordView.vue'),
    },
  ],
})

export default router
