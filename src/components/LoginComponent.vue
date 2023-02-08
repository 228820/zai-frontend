<template>
    <div class="col-md-12">
        <div class="card card-container">
            <img
                id="profile-img"
                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                class="profile-img-card"
            />
            <Form @submit="handleLogin" :validation-schema="schema">
                <div class="form-group">
                    <label for="username">Username</label>
                    <Field name="username" type="text" class="form-control" />
                    <ErrorMessage name="username" class="error-feedback" />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <Field
                        name="password"
                        type="password"
                        class="form-control"
                    />
                    <ErrorMessage name="password" class="error-feedback" />
                </div>

                <div class="form-group">
                    <button
                        class="btn btn-primary btn-block"
                        :disabled="loading"
                    >
                        <span
                            v-show="loading"
                            class="spinner-border spinner-border-sm"
                        ></span>
                        <span>Login</span>
                    </button>
                </div>

                <div class="form-group">
                    <div
                        v-if="message"
                        class="alert"
                        :class="successful ? 'alert-success' : 'alert-danger'"
                    >
                        {{ message }}
                    </div>
                </div>
            </Form>
        </div>
    </div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import axios from 'axios'

export default {
    name: 'LoginComponent',
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        const schema = yup.object().shape({
            username: yup.string().required('Username is required!'),
            password: yup.string().required('Password is required!'),
        })

        return {
            loading: false,
            successful: false,
            message: '',
            schema,
        }
    },
    computed: {
        loggedIn() {
            const user = JSON.parse(localStorage.getItem('user'))
            return !!user?.id
        },
    },
    created() {
        if (this.loggedIn) {
            if (localStorage.getItem('user').role == 'ADMIN') {
                this.$router.push('/adminMessage')
            } else {
                this.$router.push('/userMessage')
            }
        }
    },
    methods: {
        delay(time) {
            return new Promise((resolve) => setTimeout(resolve, time))
        },
        async handleLogin(user) {
            const API_URL = 'http://localhost:8080/api/auth/'
            this.loading = true
            this.successful = false

            try {
                const response = await axios.post(API_URL + 'signin', {
                    username: user.username,
                    password: user.password,
                })

                if (response.data.accessToken) {
                    this.loading = false
                    this.successful = true
                    this.message = 'Sign in successfully'
                    await this.delay(1000)

                    localStorage.setItem('user', JSON.stringify(response.data))

                    if (response.data.role === 'ADMIN') {
                        this.$router.push('/adminMessage')
                        this.$router.go(-1)
                    } else if (response.data.role === 'USER') {
                        this.$router.push('/userMessage')
                        this.$router.go(-1)
                    }
                }
            } catch (e) {
                this.message = 'Bad credential'
                this.loading = false
            }
        },
    },
}
</script>

<style scoped>
label {
    display: block;
    margin-top: 10px;
}
.card-container.card {
    max-width: 350px !important;
    padding: 40px 40px;
}
.card {
    background-color: #f7f7f7;
    padding: 20px 25px 30px;
    margin: 0 auto 25px;
    margin-top: 50px;
    -moz-border-radius: 2px;
    -webkit-border-radius: 2px;
    border-radius: 2px;
    -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
}
.profile-img-card {
    width: 96px;
    height: 96px;
    margin: 0 auto 10px;
    display: block;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
    border-radius: 50%;
}
.error-feedback {
    color: red;
}
</style>
