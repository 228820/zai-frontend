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

  name: "HomeComponent",
  data() {
    return {
      content: "",
    };
  },
  async mounted() {
    const API_URL = 'http://localhost:8080/api/auth/'
    const response = await axios.get(API_URL + 'all')
    this.content = response.data;
  },
};
</script>
