<template>
  <v-app class="custom-font">

    <!-- NAVBAR -->
    <NavbarVue/>

    <!-- CONTENT -->
    <v-main class="ma-2">
      <router-view/>
    </v-main>

    <!-- NOTIFICATIONS ON TOP -->
    <globalSnackbarVue></globalSnackbarVue>
  
  </v-app>
</template>

<script>
import NavbarVue from "./components/Navbar.vue";
import globalSnackbarVue from "./components/globalSnackbar.vue";

export default {
  name: 'App',

  components: {
    NavbarVue,
    globalSnackbarVue
  },

  beforeCreate() {
    // prevent unwanted popup of snackbar at page reload
    this.$store.dispatch('hideMessage');
    // set tab title
    document.title = "BP - Czirok (preview)"
  }

};
</script>

<style>
  :root {
    --main-color: #1a936f;
    --button-color: #F3E9D2;
    --button-second-color: #c1d6b8;
    --green-background-color: #C6DABF;
    --main-text-color: #114B5F;
    --desc-text-color: rgba(17, 75, 95, 0.76);
  }

  .b-g {
    background-color: var(--green-background-color);
    height: 95%;
  }

  .b-p {
    background-color: var(--main-color);
  }

  .show-border {
    border: solid 1px red;
  }

  /*.custom-font {
    font-family: 'Raleway', sans-serif;
  }*/
  .t-t-color {
    color: var(--main-text-color) !important;
  }
  .d-t-color {
    color: var(--desc-text-color) !important;
  }
  .bold {
    font-weight: 600;
  }

  .no-uppercase {
    text-transform: unset !important;
  }

  .scaled-test {
    transform: scale(200%);
  }
  .scaled-task {
    transform: scale(50%);
  }

  .border {
    border: solid 2px red;
  }

  .button-border {
    border: solid 3px #F3E9D2 !important;
  }
</style>