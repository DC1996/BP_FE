<template>
    <v-overlay :light='true' :dark='false' color="white" opacity="1">
        <v-container class="d-flex flex-column align-center">
                <!-- LOGIN FORM -->
                <v-form ref="form" v-model="valid" @submit="loginUser($event)">
                    <v-container class="d-flex flex-column align-center b-g rounded-lg pa-7 elevation-3">
                    <!-- LOGO -->
                        <div class="d-flex align-center mb-6">
                            <v-img 
                                alt="Math Logo by IC" class="shrink" 
                                contain src="../../assets/math_logo2.svg" width="130"/>
                        </div>

                        <!-- E-mail input -->
                        <p class="ma-0 pl-1 text-left font-weight-medium align-self-start">E-mail</p>
                        <v-text-field
                            dense solo type="text" 
                            style="width: 17.5rem"
                            prepend-inner-icon="mdi-at"
                            required v-model="email" :rules="rules['email']">
                        </v-text-field>
                        
                        <!-- Password input -->
                        <p class="ma-0 pl-1 text-left font-weight-medium align-self-start">Password</p>
                        <v-text-field
                            dense solo prepend-inner-icon="mdi-lock-outline"
                            required v-model="password" :rules="rules['password']"
                            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="showPassword ? 'text' : 'password'"
                            @click:append="showPassword = !showPassword">
                        </v-text-field>
                        <!-- 
                        <p 
                            @click="$router.push({ name: 'resetPassword' })" 
                            style="cursor: pointer" 
                            class="text-underline text-caption mt-3"> 
                            Forgot password? 
                        </p>
                        -->
                        
                        <!-- Buttons -->
                        <v-btn type="submit" :loading="loading" class="px-14 py-2 mt-4" color="primary"> 
                            Login 
                        </v-btn>
                        <p @click="$router.push({name: 'register'})" 
                            style="cursor: pointer" class="text-underline text-caption mt-3"> 
                            Create an account 
                        </p>
                    </v-container>
                </v-form>
        </v-container>
    </v-overlay>
</template>

<script>
    import {mapActions} from 'vuex';
    import UserDataService from '../../services/userDataService';

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
                showPassword: false,
            }
        },

        methods: {
            ...mapActions({
                setLoginType: 'app/setLoginType',
                setLoggedIn: 'app/setLoggedIn',
            }),
            async loginUser(e) {

                // Validate user input
                e.preventDefault();
                if(this.$refs.form.validate() == false) return;

                // Create user from credentails
                let user = {email: this.email, password: this.password};

                this.loading = true;

                // Gives a sense of calculation, shows loading to user
                await new Promise(resolve => setTimeout(resolve, 500));

                // Try to log the user in
                UserDataService.login(user).then((res) => {

                    // Save information about user
                    this.$store.dispatch('setLoggedIn', { loggedIn: true, userID: res.data.data.id });
                    this.$store.dispatch('setLoginType', { loginType: res.data.data.type });
                    localStorage.setItem('token', res.data.data.token);

                    // Show 'Logged in' message 
                    this.$store.dispatch('showMessage', { message: res.data.message });

                    this.moveToPage('home');
                    this.loading = false;
                })
                .catch((err) => {
                    console.log(err);
                    this.$store.dispatch('showMessage', 
                        { message: "There was a problem with your login.", success: false }
                    );
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