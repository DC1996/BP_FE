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