import { createWebHistory, createRouter } from 'vue-router'
import HomeComponent from './components/HomeComponent.vue'
import LoginComponent from './components/LoginComponent.vue'
import RegisterComponent from './components/RegisterComponent.vue'
import UserComponent from './components/UserComponent.vue'
import AdminComponent from './components/AdminComponent.vue'
import UsersListComponent from './components/UsersListComponent.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeComponent,
    },
    {
        path: '/home',
        component: HomeComponent,
    },
    {
        path: '/login',
        component: LoginComponent,
    },
    {
        path: '/register',
        component: RegisterComponent,
    },
    {
        path: '/userMessage',
        component: UserComponent,
    },
    {
        path: '/adminMessage',
        component: AdminComponent,
    },
    {
        path: '/users',
        component: UsersListComponent,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register', '/home', '/']
    const authRequired = !publicPages.includes(to.path)
    const loggedIn = JSON.parse(localStorage.getItem('user'))

    if (authRequired && !loggedIn) {
        next('/login')
    } else {
        next()
    }
})

export default router
