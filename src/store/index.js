import Vue from "vue";
import Vuex from "vuex";

// Makes the data peristent even after reload
import createPersistedState from "vuex-persistedstate";

// Sub-stores
import snackbarDataModule from "./modules/snackbarData.module.js";
import testDataModule from "./modules/testData.module.js";
import appDataModule from "./modules/appData.module.js";

/**
 * Setup a persistent global storage
 * that can be accessed from any component
 * of the application
 */
Vue.use(Vuex);
export default new Vuex.Store({
  // Persistent storage plugin
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
  // Divide main store into submodules for
  // better modularity and better readability
  modules: {
    test: testDataModule,
    snackbar: snackbarDataModule,
    app: appDataModule,
  },
});
