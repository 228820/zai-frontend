import { createWebHistory, createRouter } from 'vue-router'
import Home from './components/HomeComponent.vue'
import Login from './components/LoginComponent.vue'
import Register from './components/RegisterComponent.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/home',
        component: Home,
    },
    {
        path: '/login',
        component: Login,
    },
    {
        path: '/register',
        component: Register,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router
