<template>
  <v-app class="custom-font">

    <!-- NAVBAR -->
    <NavbarVue/>

    <!-- CONTENT -->
    <v-main class="ma-2">
      <createtaskpageVue/>
    </v-main>
  
  </v-app>
</template>

<script>
import NavbarVue from "./Navbar.vue";
import createtaskpageVue from "./createtaskpage.vue";

export default {

  components: {
    NavbarVue,
    createtaskpageVue
  },
  
};
</script>

<style>

</style>