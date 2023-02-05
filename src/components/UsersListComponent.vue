<template>
    <div class="container">
        <header class="jumbotron">
            <h1>Here will be users list</h1>
            <h3 v-if="content.length != 0">{{ content }}</h3>
        </header>
        <div v-for="user in users" :key="user.id" class="card">
            <div class="card-header">Id: {{ user.id }}</div>
            <div class="card-body">
                <h5 class="card-title">Username: {{ user.username }}</h5>
                <p class="card-text">Email: {{ user.email }}</p>
                <p class="card-text">Role: {{ user?.roles?.[0]?.role }}</p>

                <a href="#" class="btn btn-primary">Edit User</a>
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
            users: [],
            content: '',
        }
    },
    async mounted() {
        try {
            const API_URL = 'http://localhost:8080/api/users/'
            const user = JSON.parse(localStorage.getItem('user'))
            if (user.role == 'ADMIN') {
                const response = await axios.get(API_URL + `?page=${1}`, {
                    headers: { Authorization: 'Bearer ' + user.accessToken },
                })
                console.log(response)
                this.users = response.data.content
            } else if (user.role == 'USER') {
                const response = await axios.get(API_URL + `${user.id}`, {
                    headers: { Authorization: 'Bearer ' + user.accessToken },
                })
                this.users = [response.data]
                console.log(response.data)
            } else {
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
