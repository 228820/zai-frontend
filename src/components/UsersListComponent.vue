<template>
    <div class="container">
        <header class="jumbotron">
            <h1>Users list</h1>
            <h3 v-if="content.length != 0">{{ content }}</h3>
        </header>
        <nav v-if="isUserAdmin" aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item" @click="previousPage">
                    <a class="page-link" href="#">Previous</a>
                </li>
                <li class="page-item" @click="nextPage">
                    <a class="page-link" href="#">Next</a>
                </li>
            </ul>
        </nav>
        <div v-for="user in users" :key="user.id" class="card">
            <div class="card-header">Id: {{ user.id }}</div>
            <div class="card-body">
                <h5 class="card-title">Username: {{ user.username }}</h5>
                <p class="card-text">Email: {{ user.email }}</p>
                <p class="card-text">Role: {{ user?.roles?.[0]?.role }}</p>

                <router-link
                    :to="{ name: 'editUser', params: { id: user.id } }"
                    class="nav-link"
                >
                    <p class="btn btn-primary myButton">Edit User</p>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'UserListComponent',
    data() {
        return {
            API_URL: 'http://localhost:8080/api/users/',
            users: [],
            content: '',
            page: 1,
            pageCount: 5,
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
        async previousPage() {
            if (this.page > 1) {
                this.page--
                this.users = []
                const user = JSON.parse(localStorage.getItem('user'))

                await this.getDataForAdmin(user)
            }
        },
        async nextPage() {
            if (this.page < this.pageCount - 1) {
                this.page++
                this.users = []
                const user = JSON.parse(localStorage.getItem('user'))

                await this.getDataForAdmin(user)
            }
        },
        async getDataForUser(user) {
            const response = await axios.get(this.API_URL + `${user.id}`, {
                headers: { Authorization: 'Bearer ' + user.accessToken },
            })
            this.users = [response.data]
        },
        async getDataForAdmin(user) {
            const response = await axios.get(
                this.API_URL + `?page=${this.page}`,
                {
                    headers: { Authorization: 'Bearer ' + user.accessToken },
                }
            )

            this.users = response.data.content
            this.pageCount = response.data.totalPages
        },
    },
    async mounted() {
        try {
            const user = JSON.parse(localStorage.getItem('user'))

            if (this.isUserAdmin) {
                await this.getDataForAdmin(user)
            } else if (this.isUser) {
                await this.getDataForUser(user)
            } else {
                localStorage.removeItem('user')
                this.$router.go(0)
                this.content =
                    "You don't have perrmission to access this resource"
            }
        } catch (e) {
            if (e.response.status == 403) {
                this.content =
                    "You don't have perrmission to access this resource"
            } else {
                this.content = 'Something went wrong, please try again later'
            }
        }
    },
}
</script>

<style scoped>
.myButton {
    margin-left: -1em;
}
</style>
