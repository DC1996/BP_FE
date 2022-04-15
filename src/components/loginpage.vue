<template>
    <v-overlay :light='true' :dark='false' color="white" opacity="1">
        <v-container class="d-flex flex-column align-center">
                <!-- LOGIN FORM -->
                <v-form v-model="valid">
                    <v-container class="d-flex flex-column align-center b-g rounded-lg pa-7 elevation-3">
                    <!-- LOGO -->
                        <div class="d-flex align-center mb-6">
                            <router-link to="/">
                            <v-img alt="Math Logo by IC" class="shrink" contain src="../assets/math_logo2.svg" width="130"/>
                            </router-link>
                        </div>

                        <!-- E-mail input -->
                        <p class="ma-0 pl-1 text-left font-weight-medium align-self-start">E-mail</p>
                        <v-text-field
                            dense solo type="text" 
                            prepend-inner-icon="mdi-at"
                            required v-model="email" :rules="rules['email']">
                        </v-text-field>
                        
                        <!-- Password input -->
                        <p class="ma-0 pl-1 text-left font-weight-medium align-self-start">Password</p>
                        <v-text-field
                            dense solo type="password" hide-details
                            prepend-inner-icon="mdi-lock-outline"
                            required v-model="password" :rules="rules['password']">
                        </v-text-field>
                        <v-btn to="/" text plain :ripple="false" class="mb-6 px-3 py-0 no-uppercase">
                            <p class="ma-0 pa-0 text-caption">Forgot password?</p>
                        </v-btn>
                        
                        <!-- Buttons -->
                        <v-btn @click="loginUser()" :loading="loading" block class="px-6 py-2" color="primary"> Login </v-btn>
                        <v-btn to="/register" :ripple="false" text plain class="mt-4 mb-0 px-3 py-1 no-uppercase text-caption"> 
                            Create an account 
                        </v-btn>
                    </v-container>
                </v-form>
        </v-container>
    </v-overlay>
</template>

<script>
import {mapActions} from 'vuex';
import UserDataService from '../services/userDataService';

export default {
    data() {
        return {
            email: '',
            password: '',
            rules: {
                email: [
                    v => !!v || 'E-mail is required',
                    v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                ],
                password: [
                    v => !!v || 'Password is required',
                ] 
            },

            valid: true,

            loading: false,
        }
    },

    methods: {
        ...mapActions({
            setLoginType: 'app/setLoginType',
            setLoggedIn: 'app/setLoggedIn',
        }),
        async loginUser() {
            console.log(this.email, ' --- ', this.password);
            let user = {email: this.email, password: this.password};

            this.loading = true;

            // Gives a sense of calculation, shows loading to user
            await new Promise(resolve => setTimeout(resolve, 750));

            UserDataService.login(user).then((res) => {
                console.log(res);
                localStorage.setItem('loggedIn', false);
                this.$store.dispatch('showMessage', { message: res.data.message });

                // Save type
                this.$store.dispatch('setLoggedIn', { loggedIn: true, userID: res.data.data.id });
                this.$store.dispatch('setLoginType', { loginType: res.data.data.type });
                localStorage.setItem('token', res.data.data.token);

                this.moveToPage('home');
                this.loading = false;
            })
            .catch((err) => {
                this.$store.dispatch('showMessage', { message: "Wrong credentials! Try again.", success: false });
                this.loading = false;
            });
        }
    },
}
</script>

<style> 
    .border-outline{
        border: solid 1px var(--main-color);
    }
</style>