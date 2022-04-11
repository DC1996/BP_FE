<template>
  <v-app-bar id="navbar" app elevate-on-scroll hide-on-scroll fade-on-scroll light height='80px' color="white" rounded class="px-8 elevation-2">
      
      <v-row justify="center" align="center" style="height: 100%">
      
        <div class="d-flex align-center">
            <router-link to="/">
              <v-img alt="Math Logo by IC" class="shrink" contain src="../assets/math_logo2.svg" transition="fab-transition" width="130"/>
            </router-link>
        </div>

      <v-spacer></v-spacer>

      <v-btn v-if="$store.state.app.loggedIn && $store.state.app.loginType == 'teacher' && $router.url != '/'" @click="moveToCreateTask()" text large class="no-uppercase mx-3" color="primary">
        <span class="">Create task</span>
      </v-btn>                
      
      <v-btn v-if="$store.state.app.loggedIn && $store.state.app.loginType == 'teacher'" @click="moveToCreateTest()" text large class="no-uppercase mx-3" color="primary">
        <span>Create test</span>
      </v-btn>

      <v-btn v-if="!$store.state.app.loggedIn" to="/login" text large class="no-uppercase mx-4" color="primary">
        <v-icon class="mr-2">mdi-login</v-icon>
        Login
      </v-btn>

      <v-menu v-if="$store.state.app.loggedIn" bottom offset-y left class="elevation-0">
      <template v-slot:activator="{ on, attrs }">
        <v-btn text class="no-uppercase ml-3" color="primary" large v-bind="attrs" v-on="on">
          <v-icon class="mr-3">mdi-account-circle-outline</v-icon>
          Profile
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </template>

      <!-- Menu options -->
      <v-list class="elevation-0">
        <div v-if="$store.state.app.loggedIn">
        <v-list-item
          v-for="(item, index) in getLoggedInMenuOptions" :key="index">
          <v-btn 
            @click="moveToPage(item.pageName)" block text class="d-flex justify-start no-uppercase ma-0">
            <v-icon small class="mr-2">{{ item.icon }}</v-icon>
            {{ item.name }}
          </v-btn>
        </v-list-item>
        </div>
        <v-list-item>
          <v-btn @click="logoutUser()" block text class="d-flex justify-start no-uppercase ma-0">
            <v-icon small class="mr-2">mdi-logout</v-icon>
            Logout
          </v-btn>
        </v-list-item>
      </v-list>
    </v-menu>

    </v-row>
    </v-app-bar>
</template>

<script>import {mapActions} from "vuex";

  export default {
    data() {
      return {
        loggedIn: true,
        teacherMenuOptions: [
          { name: 'Your tasks', pageName: 'yourTasks', icon: 'mdi-text'},
          { name: 'Your tests', pageName: 'yourTests', icon: 'mdi-note-multiple-outline'},
        ],
        studentMenuOptions: [
          { name: 'Your assignments', pageName: 'yourAssignments', icon: 'mdi-note-multiple-outline'},
        ]
      }
    },

    beforeMount() {},

    methods: {  
      ...mapActions({
        startTestCreation: 'test/startTestCreation'
      }),

      // Log out the user
      logoutUser() {
        this.$store.dispatch('setLoggedIn', { value: false });
        localStorage.clear();
        this.moveToPage('login');
      }
    },

    computed: {
      // Filter login options in menu
      getLoggedInMenuOptions() {
        return (this.$store.state.app.loggedIn && this.$store.state.app.loginType == 'teacher') ? this.teacherMenuOptions : this.studentMenuOptions;
      },
    }
      
  }
</script>

<style></style>