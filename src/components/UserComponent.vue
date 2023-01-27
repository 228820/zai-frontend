<template>
    <div class="container">
        <header class="jumbotron">
            <h3>{{ content }}</h3>
        </header>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: 'UserComponent',
    data() {
        return {
            content: '',
        }
    },
    async mounted() {
        const API_URL = 'http://localhost:8080/api/messages'
        const user = JSON.parse(localStorage.getItem('user'))
        const response = await axios.get(API_URL + 'user', {
            headers: { Authorization: 'Bearer ' + user.accessToken },
        })
        this.content = response.data
    },
}
</script>
