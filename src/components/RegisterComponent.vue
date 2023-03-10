<template>
    <div class="col-md-12">
        <div class="card card-container">
            <img
                id="profile-img"
                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                class="profile-img-card"
            />
            <Form @submit="handleRegister" :validation-schema="schema">
                <div v-if="!successful">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <Field
                            name="username"
                            type="text"
                            class="form-control"
                        />
                        <ErrorMessage name="username" class="error-feedback" />
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <Field name="email" type="email" class="form-control" />
                        <ErrorMessage name="email" class="error-feedback" />
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
                            Sign Up
                        </button>
                    </div>
                </div>
            </Form>

            <div
                v-if="message"
                class="alert"
                :class="successful ? 'alert-success' : 'alert-danger'"
            >
                {{ message }}
            </div>
        </div>
    </div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import axios from 'axios'

export default {
    name: 'RegisterComponent',
    components: {
        Form,
        Field,
        ErrorMessage,
    },
    data() {
        const schema = yup.object().shape({
            username: yup
                .string()
                .required('Username is required!')
                .min(3, 'Must be at least 3 characters!')
                .max(20, 'Must be maximum 20 characters!'),
            email: yup
                .string()
                .required('Email is required!')
                .email('Email is invalid!')
                .max(20, 'Must be maximum 50 characters!'),
            password: yup
                .string()
                .required('Password is required!')
                .min(6, 'Must be at least 6 characters!')
                .max(80, 'Must be maximum 40 characters!'),
        })

        return {
            successful: false,
            loading: false,
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
    mounted() {
        if (this.loggedIn) {
            if (JSON.parse(localStorage.getItem('user')).role == 'ADMIN') {
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
        async handleRegister(user) {
            const API_URL = 'http://localhost:8080/api/auth/'
            this.message = ''
            this.successful = false
            this.loading = true

            let response
            try {
                response = await axios.post(API_URL + 'signup', {
                    username: user.username,
                    email: user.email,
                    password: user.password,
                })
                if (response.status == 200) {
                    this.message = 'Register successfully'
                    this.successful = true
                    this.loading = false
                    await this.delay(1000)
                    this.$router.push('/login')
                } else {
                    this.message = response.data.message.Message
                    this.successful = false
                    this.loading = false
                }
            } catch (e) {
                this.message = e?.response?.data?.Error
                this.successful = false
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
