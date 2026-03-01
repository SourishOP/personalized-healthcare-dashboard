import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AuthScreen from '../views/AuthScreen.vue'
import DashboardScreen from '../views/DashboardScreen.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: AuthScreen,
            meta: { guest: true }
        },
        {
            path: '/register',
            redirect: '/login'
        },
        {
            path: '/dashboard',
            name: 'dashboard',
            component: DashboardScreen,
            meta: { requiresAuth: true }
        },
        {
            path: '/log',
            name: 'log',
            component: () => import('../views/LogVitalsScreen.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/trends',
            name: 'trends',
            component: () => import('../views/TrendsScreen.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/reminders',
            name: 'reminders',
            component: () => import('../views/RemindersScreen.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/settings',
            name: 'settings',
            component: () => import('../views/SettingsScreen.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/',
            redirect: '/dashboard'
        }
    ]
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore()
    const isAuthenticated = !!auth.token

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
    } else if (to.meta.guest && isAuthenticated) {
        next('/dashboard')
    } else {
        next()
    }
})

export default router
