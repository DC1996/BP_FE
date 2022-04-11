<template>
    <v-overlay :light='true' :dark='false' color="white" opacity="1">
        <v-container class="d-flex flex-column align-center">

                <!-- REGISTER FORM -->
                <v-form v-model="valid">
                    <v-container class="d-flex flex-column align-center b-g rounded-lg pa-7 elevation-3">
                    <!-- LOGO -->
                        <div class="d-flex align-center mb-6">
                            <router-link to="/">
                            <v-img alt="Math Logo by IC" class="shrink" contain src="../assets/math_logo2.svg" width="130"/>
                            </router-link>
                        </div>

                        <!-- Name input -->
                        <p class="ma-0 pl-1 text-left font-weight-medium align-self-start">Name</p>
                        <v-text-field
                            dense solo type="text" 
                            prepend-inner-icon="mdi-account-outline"
                            v-model="name" :rules="rules['required']">
                        </v-text-field>
                        <!-- Surname input -->
                        <p class="ma-0 pl-1 text-left font-weight-medium align-self-start">Surname</p>
                        <v-text-field
                            dense solo type="text" 
                            prepend-inner-icon="mdi-account-outline"
                            v-model="surname" :rules="rules['required']">
                        </v-text-field>

                        <!-- Type of user -->
                        <p class="ma-0 pl-1 text-left font-weight-medium align-self-start"> Role </p>
                        <v-radio-group row v-model="userType" hide-details class="mt-0 mb-2" required>
                                <v-radio label="Student" value="0"></v-radio>
                                <v-radio label="Teacher" value="1"></v-radio>
                        </v-radio-group>

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
                            dense solo type="password"
                            prepend-inner-icon="mdi-lock-outline"
                            required v-model="password" :rules="rules['required']">
                        </v-text-field>
                        
                        <!-- Buttons -->
                        <v-btn @click="registerUser()" :loading="loading" block class="px-6 py-2" color="primary"> Register </v-btn>
                        <v-btn to="/login" :ripple="false" text plain class="mt-4 mb-0 px-3 py-1 no-uppercase text-caption"> I already have an account </v-btn>
                    </v-container>
                </v-form>
        </v-container>
    </v-overlay>
</template>

<script>
import UserDataService from '../services/userDataService';

export default {
    data() {
        return {
            name: '',
            surname: '',
            email: '',
            password: '',
            rules: {
                email: [
                    v => !!v || 'E-mail is required',
                    v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                ],
                required: [
                    v => !!v || 'This field is required',
                ]
            },

            userType: 0,
            userTypes: ['student', 'teacher', 'admin'],

            loading: false,
            valid: false,
        }
    },

    methods: {
        async registerUser() {
            const newUser = {
                name: this.name,
                surname: this.surname,
                email: this.email,
                password: this.password,
                type: this.userTypes[this.userType]
            }

            this.loading = true;

            // Gives a sense of calculation, shows loading to user
            await new Promise(resolve => setTimeout(resolve, 1000));

            UserDataService.create(newUser)
            .then((res) => {
                console.log(res); 
                this.loading = false;
                this.moveToPage('login');
                this.$store.dispatch('showMessage', {message: 'Account created! You can now log in.'});
            })
            .catch((err) => {
                // TODO nevyplnene udaje
                console.log("Error:", err);
                this.loading = false;
                this.$store.dispatch('showMessage',{message: "Something went wrong!", success: false});
            })
        }
    }
}
</script>

<style> 
    .border-outline{
        border: solid 1px var(--main-color);
    }
</style>