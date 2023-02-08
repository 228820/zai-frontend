<template>
    <div class="col-md-12">
        <div class="card card-container">
            <img
                id="profile-img"
                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                class="profile-img-card"
            />
            <Form
                @submit="handleUserEdit"
                :validation-schema="isUser ? schemaForUser : schemaForAdmin"
            >
                <div v-if="!successful">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <Field
                            name="username"
                            type="text"
                            class="form-control"
                            v-model="user.username"
                        />
                        <ErrorMessage name="username" class="error-feedback" />
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <Field
                            name="email"
                            type="email"
                            class="form-control"
                            v-model="user.email"
                        />
                        <ErrorMessage name="email" class="error-feedback" />
                    </div>
                    <div v-if="isUser" class="form-group">
                        <label for="password">Password</label>
                        <Field
                            name="password"
                            type="password"
                            class="form-control"
                            v-model="user.password"
                        />
                        <ErrorMessage name="password" class="error-feedback" />
                    </div>

                    <div v-if="isUserAdmin" class="form-group">
                        <label for="roleSelect">Role</label>
                        <select class="form-control" v-model="user.role">
                            <option :selected="isUser" value="USER">
                                USER
                            </option>
                            <option :selected="isUserAdmin" value="ADMIN">
                                ADMIN
                            </option>
                        </select>
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
                            Edit User
                        </button>
                        <button
                            class="btn btn-outline-primary btn-block"
                            @click="cancelEdit"
                        >
                            Cancel
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
        const schemaForUser = yup.object().shape({
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

        const schemaForAdmin = yup.object().shape({
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
        })

        return {
            API_URL: 'http://localhost:8080/api/users/',
            successful: false,
            loading: false,
            message: '',
            schemaForUser,
            schemaForAdmin,
            user: {
                username: '',
                email: '',
                password: '',
                role: 'user',
            },
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
    async mounted() {
        const user = JSON.parse(localStorage.getItem('user'))
        const response = await axios.get(
            this.API_URL + `${this.$route.params.id}`,
            {
                headers: { Authorization: 'Bearer ' + user.accessToken },
            }
        )

        this.user.username = response.data.username
        this.user.email = response.data.email
        this.user.role = response.data.roles[0].role
    },
    methods: {
        delay(time) {
            return new Promise((resolve) => setTimeout(resolve, time))
        },
        async handleUserEdit() {
            this.message = ''
            this.successful = false
            this.loading = true

            const user = JSON.parse(localStorage.getItem('user'))
            if (user) {
                try {
                    await axios.put(
                        this.API_URL + `${this.$route.params.id}`,
                        {
                            username: this.user.username,
                            email: this.user.email,
                            password: this.user.password,
                            role: [this.user.role.toLowerCase()],
                        },
                        {
                            headers: {
                                Authorization: 'Bearer ' + user.accessToken,
                            },
                        }
                    )

                    this.message = 'User edit successfully'
                    this.successful = true
                    this.loading = false
                    await this.delay(2000)
                    this.$router.go(-1)
                } catch (e) {
                    if (e.response.status == 403 || e.response.status == 401) {
                        this.message =
                            "You don't have perrmission to access this resource"
                    } else {
                        this.message =
                            'Something went wrong, please try again later'
                    }
                    this.successful = false
                    this.loading = false
                }
            } else {
                this.message = 'Something went wrong, please try again later'
                this.successful = false
                this.loading = false
            }
        },
        cancelEdit() {
            this.$router.go(-1)
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
