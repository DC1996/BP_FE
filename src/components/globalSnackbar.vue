<!-- 
 * File: globalSnackbar.vue
 * Description: Implements a global snackbar using Vuex
 *
 * Project: Bachelor's Thesis - Web system for Math tests creation
 * Author: xcziro00, David Czirok
 *
 * Last modified: 07-05-2022
 -->

<template>
  <v-snackbar 
    transition="slide-y-transition"
    v-model="$store.state.snackbar.visible"
    :color="$store.state.snackbar.success ? 'green' : 'red'" 
    :timeout="$store.state.snackbar.timeout" 
    top>
    {{ $store.state.snackbar.message }}
  </v-snackbar>
</template>

<script>
  export default {
    name: "globalSnackbar" 
  }
</script>