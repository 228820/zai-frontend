<template>
    <div id="app">
        <nav class="navbar navbar-expand navbar-dark bg-dark">
            <a href="/" class="navbar-brand">ZAI</a>
            <div class="navbar-nav mr-auto">
                <li class="nav-item">
                    <router-link to="/home" class="nav-link">
                        <font-awesome-icon icon="home" /> Home
                    </router-link>
                </li>
                <li v-if="currentUser" class="nav-item">
                    <router-link to="/users" class="nav-link"
                        >Users</router-link
                    >
                </li>
                <li v-if="isUser" class="nav-item">
                    <router-link to="/userMessage" class="nav-link"
                        >User message</router-link
                    >
                </li>
                <li v-if="isUserAdmin" class="nav-item">
                    <router-link to="/adminMessage" class="nav-link"
                        >Admin message</router-link
                    >
                </li>
            </div>

            <div v-if="!currentUser" class="navbar-nav ml-auto">
                <li class="nav-item">
                    <router-link to="/register" class="nav-link">
                        <font-awesome-icon icon="user-plus" /> Sign Up
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/login" class="nav-link">
                        <font-awesome-icon icon="sign-in-alt" /> Login
                    </router-link>
                </li>
            </div>

            <div v-if="currentUser" class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a class="nav-link" @click.prevent="logOut">
                        <font-awesome-icon icon="sign-out-alt" /> LogOut
                    </a>
                </li>
            </div>
        </nav>

        <div class="container">
            <router-view />
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            isLoggedIn: JSON.parse(localStorage.getItem('user')) || false,
        }
    },
    computed: {
        currentUser() {
            const user = JSON.parse(localStorage.getItem('user'))
            return !!user?.id
        },
        isUserAdmin() {
            if (this.currentUser) {
                return JSON.parse(localStorage.getItem('user')).role == 'ADMIN'
            }
            return false
        },
        isUser() {
            if (this.currentUser) {
                return (
                    JSON.parse(localStorage.getItem('user')).role != 'ADMIN' &&
                    JSON.parse(localStorage.getItem('user')).role == 'USER'
                )
            }
            return false
        },
    },
    methods: {
        logOut() {
            localStorage.removeItem('user')
            this.$router.go()
            this.$router.push('/login')
        },
    },
}
</script>

<style scoped>
.nav-link {
    cursor: pointer;
}
</style>
