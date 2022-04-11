<template>
    <v-container class="d-flex flex-row justify-center align-center mt-4">

        <v-card v-if="$store.state.app.loggedIn && $store.state.app.loginType == 'teacher'"
          class="justify-center align-start px-8 py-4 mx-8 my-2" 
          color="var(--green-background-color)" min-width="400" max-width="400" min-height="480" max-height="480" :elevation="5"
        >
          <v-card-title class="t-t-color bold font-weight-medium text-h5">Create task</v-card-title>
          <v-card-text  class="d-t-color font-weight-normal text-body-1"> 
            You can create your own task in a few simple steps.
          </v-card-text>
          
            <v-img
              alt="Man sitting, reading a math book, pi symbol"
              class="shrink mx-auto my-0 py-0"
              contain
              transition="scale-transition"
              src="../assets/undraw_create_task.svg"
              max-height="220"
            />

          <v-card-actions class="d-flex flex-row justify-space-around mt-6">
            <!-- <v-btn 
              to="/yourTasks"
              elevation="4" large rounded color="var(--button-second-color)" 
              class="px-8 py-2 ma-0 no-uppercase t-t-color button-border"
            >
              All tasks
            </v-btn> -->
            <v-btn 
              @click="moveToCreateTask()"
              elevation="0" large color="white"
              class="px-8 py-2 ma-0 no-uppercase t-t-color">
              Create task
            </v-btn>
          </v-card-actions>

        </v-card>
        
        <v-card v-if="$store.state.app.loggedIn && $store.state.app.loginType == 'teacher'"
          class="justify-center align- px-8 py-4 mx-8 my-2" 
          color="var(--green-background-color)" min-width="400" max-width="400" min-height="480" max-height="480" :elevation="5"
        >
          <v-card-title class="t-t-color bold font-weight-medium text-h5">Create test</v-card-title>
          <v-card-text  class="d-t-color font-weight-normal text-body-1"> 
            You can create your own test from existing tasks.
          </v-card-text>
          
            <v-img
              alt="Forms, question marks, cartoon character"
              class="shrink mx-auto mt-9 pt-1"
              contain
              src="../assets/undraw_create_test.svg"
              max-height="240"
              transition="scale-transition"/>

          <v-card-actions class="d-flex flex-row justify-space-around mt-6">
            <v-btn 
                @click="moveToCreateTest()"
                elevation="0" large color="white"
                class="px-8 py-2 ma-0 no-uppercase t-t-color">
                Create test
            </v-btn>
          </v-card-actions>

        </v-card>

        <v-card v-if="$store.state.app.loggedIn && $store.state.app.loginType == 'student'"
          class="justify-center align-start px-8 py-4 mx-8 my-2" 
          color="accent" min-width="400" max-width="400" min-height="480" max-height="480" :elevation="5"
        >
          <v-card-title class="t-t-color bold font-weight-medium text-h5"> Your assignments </v-card-title>
          <v-card-text  class="d-t-color font-weight-normal text-body-1"> 
            See all assignments from your teachers and their results in one place.
          </v-card-text>
          
            <v-img
              alt="Man sitting, reading a math book, pi symbol"
              class="shrink mx-auto my-0 py-0"
              contain
              transition="scale-transition"
              src="../assets/undraw_create_task.svg"
              max-height="220"
            />

          <v-card-actions class="d-flex flex-row justify-space-around mt-6">
            <v-btn 
              to="/yourAssignments"
              elevation="3" large color="white"
              class="px-8 py-2 ma-0 no-uppercase t-t-color">
              Assignments
            </v-btn>
          </v-card-actions>

        </v-card>
        
      </v-container>
</template>

<script>
import userDataService from '../services/userDataService';

  export default {
    beforeCreate() {
      console.log(this.$store.state.app.loggedIn);
      console.log(this.$store.state.app.loginType);
    },
  }
</script>