/*
 * File: vuetify.js
 * Description: Vuetify config file
 *
 * Project: Bachelor's Thesis - Web system for Math tests creation
 * Author: xcziro00, David Czirok
 *
 * Last modified: 07-05-2022
 */

import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

// Theme setting
Vue.use(Vuetify);
export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#1A936F",
        secondary: "#F3E9D2",
        accent: "#C6DABF",
        error: "#B71C1C",
        success: "#04B804",
        text: "#114B5F",
      },
    },
  },
});
