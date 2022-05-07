<!-- 
 * File: registerpage.vue
 * Description: Implements the register page and functions
 *
 * Project: Bachelor's Thesis - Web system for Math tests creation
 * Author: xcziro00, David Czirok
 *
 * Last modified: 07-05-2022
 -->

<template>
    <v-overlay :light='true' :dark='false' color="white" opacity="1">
        <v-container class="d-flex flex-column align-center">
            
            <!-- REGISTER FORM -->
            <v-form ref="form" v-model="valid" @submit="registerUser($event)">
                <v-container style="width: 600px" 
                    class="d-flex flex-column align-center b-g rounded-lg px-7 py-3 elevation-3">
                    <v-row>
                        <v-col cols="12" class="d-flex flex-row justify-center">
                        
                        <!-- LOGO -->
                            <div class="d-flex align-center mb-2">
                                <v-img 
                                    alt="Math Logo by IC" class="shrink" 
                                    contain src="../../assets/math_logo2.svg" width="130"/>
                            </div>
                        </v-col>

                        <v-col cols="6">
                            <!-- Name input -->
                            <p class="ma-0 pl-1 text-left font-weight-medium align-self-start">Name</p>
                            <v-text-field
                                style="width: 17.5rem"
                                dense solo type="text" 
                                prepend-inner-icon="mdi-account-outline"
                                v-model="name" :rules="rules['required']">
                            </v-text-field>
                        </v-col>

                        <v-col cols="6">
                            <!-- Surname input -->
                            <p class="ma-0 pl-1 text-left font-weight-medium align-self-start">Surname</p>
                            <v-text-field
                                style="width: 17.5rem"
                                dense solo type="text" 
                                prepend-inner-icon="mdi-account-outline"
                                v-model="surname" :rules="rules['required']">
                            </v-text-field>
                        </v-col>

                        <v-col cols="6">
                            <!-- E-mail input -->
                            <p class="ma-0 pl-1 text-left font-weight-medium align-self-start">E-mail</p>
                            <v-text-field
                                style="width: 17.5rem"
                                dense solo type="text" 
                                prepend-inner-icon="mdi-at"
                                required v-model="email" :rules="rules['email']">
                            </v-text-field>
                        </v-col>

                        <v-col cols="6">
                            <!-- Type of user -->
                            <p class="ma-0 pl-1 text-left font-weight-medium align-self-start"> Role </p>
                            <v-radio-group 
                                    :rules="rules['userRole']" row v-model="userType" class="mt-2 mb-2" required>
                                    <v-radio value="0">
                                        <template v-slot:label>
                                            <span style="color: black"> Student </span>
                                        </template>
                                    </v-radio>
                                    <v-radio value="1">
                                        <template v-slot:label>
                                            <span style="color: black"> Teacher </span>
                                        </template>
                                    </v-radio>
                            </v-radio-group>
                        </v-col>

                        <v-col cols="12" v-if="userType == 0">
                            <p v-if="userType == 0" class="ma-0 pl-1 text-left font-weight-medium align-self-start">Grade</p>
                            <v-select v-if="userType == 0"
                                :items="grades" v-model="grade" :rules="rules['required']"
                                solo dense placeholder="Select grade">
                            </v-select>
                        </v-col>

                        <v-col cols="6">
                            <!-- Password input -->
                            <p class="ma-0 pl-1 text-left font-weight-medium align-self-start">Password</p>
                            <v-text-field
                                style="width: 17.5rem"
                                dense solo prepend-inner-icon="mdi-lock-outline"
                                required v-model="password" :rules="rules['required']"
                                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPassword ? 'text' : 'password'"
                                @click:append="showPassword = !showPassword">
                            </v-text-field>
                        </v-col>

                        <v-col cols="6">
                            <!-- Validate Password input -->
                            <p class="ma-0 pl-1 text-left font-weight-medium align-self-start">Validate Password</p>
                            <v-text-field
                                style="width: 17.5rem"
                                dense solo prepend-inner-icon="mdi-lock-outline"
                                required v-model="passwordValidate" :rules="rules['validatePassword']"
                                :append-icon="showPasswordValidate ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPasswordValidate ? 'text' : 'password'"
                                @click:append="showPasswordValidate = !showPasswordValidate">
                            </v-text-field>
                        </v-col>
                        
                        <!-- Buttons -->
                        <v-col class="d-flex flex-column align-center">
                            <v-btn 
                                type="submit" :loading="loading" class="px-10 py-2" color="primary">
                                Register 
                            </v-btn>
                            <p 
                                @click="password = ''; validatePassword = ''; $router.push( {name: 'login'} )" 
                                :ripple="false" text plain 
                                class="mt-4 mb-0 px-3 py-1 no-uppercase text-caption" 
                                style="cursor: pointer"> 
                                I already have an account 
                            </p>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
        </v-container>
    </v-overlay>
</template>

<script>
import UserDataService from '../../services/userDataService';

export default {
    data() {
        return {
            name: '',
            surname: '',
            email: '',
            password: '',
            passwordValidate: '',
            rules: {
                email: [
                    v => !!v || 'This field is required',
                    v => /.+@.+\..+/.test(v) || 'Invalid e-mail address format',
                ],
                required: [
                    v => !!v || 'This field is required',
                ],
                validatePassword: [
                    v => !!v || 'This field is required',
                    v => v == this.password || 'Passwords must match'
                ],
                userRole: [
                    v => !!v || 'Please select your role'
                ],
            },

            userType: -1,
            userTypes: ['student', 'teacher'],

            loading: false,
            valid: false,

            showPassword: false,
            showPasswordValidate: false,

            grades: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
            grade: null       
        }
    },

    methods: {
        async registerUser(e) {

            e.preventDefault();
            if(this.$refs.form.validate() == false) {
                return;
            }

            const newUser = {
                name: this.name,
                surname: this.surname,
                email: this.email,
                password: this.password,
                grade: this.grade ?? "none",
                type: this.userTypes[this.userType]
            }

            this.loading = true;

            // Gives a sense of calculation, shows loading to user
            await new Promise(resolve => setTimeout(resolve, 500));

            UserDataService.create(newUser)
            .then((res) => {
                console.log(res); 
                this.loading = false;
                this.moveToPage('login');
                this.$store.dispatch('showMessage', {message: 'Account created! You can now log in.'});
            })
            .catch((err) => {
                console.log("Error:", err);
                this.loading = false;
                this.$store.dispatch('showMessage',{message: err.response.data.message, success: false});
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