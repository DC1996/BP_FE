import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import Navbar from "./components/Navbar.vue";
import homepageVue from "./components/homepage.vue";
import yourtasksVue from "./components/yourtasks.vue";
import yourtestsVue from "./components/yourtests.vue";
import createtaskpageVue from "./components/createtaskpage.vue";
import createTestPageVue from "./components/createTestPage.vue";
import AppCreateTaskVue from "./components/AppCreateTask.vue";

import loginpageVue from "./components/loginpage.vue";
import registerpageVue from "./components/registerpage.vue";

import globalSnackbar from "./components/globalSnackbar.vue";

import store from "./store";

// Vuetify UI Components library
import vuetify from "./plugins/vuetify";
import Vuetify from "vuetify/lib";
import "vuetify/dist/vuetify.min.css";

// MathJax
import MathJax, { initMathJax, renderByMathjax } from "mathjax-vue";
import modifyTestPageVue from "./components/modifyTestPage.vue";
import yourAssignmentsVue from "./components/yourAssignments.vue";
import takeTestPageVue from "./components/takeTestPage.vue";
import userDataService from "./services/userDataService";
initMathJax({}, () => {
  renderByMathjax(document.getElementById("latexMath"));
});
Vue.use(MathJax);

// Allow access to components
Vue.use(store);
Vue.use(Vuetify);
Vue.use(VueRouter);
Vue.use(globalSnackbar);
Vue.use(Navbar);
Vue.use(loginpageVue);
Vue.use(registerpageVue);
Vue.use(App);
Vue.use(AppCreateTaskVue);
Vue.use(createtaskpageVue);
Vue.use(createTestPageVue);
Vue.use(modifyTestPageVue);
Vue.use(homepageVue);
Vue.use(yourtasksVue);
Vue.use(yourtestsVue);

Vue.mixin({
  methods: {
    moveToPage(pageName) {
      this.$router.push({ name: pageName });
    },
    moveToCreateTask() {
      localStorage.removeItem("taskId");
      this.$router.push({ name: "createTask" });
    },
    moveToCreateTest() {
      localStorage.removeItem("testId");
      store.dispatch("test/startTestCreation").then(() => {
        this.$router.push({ name: "createTest" });
      });
    },
    modifyTask(id) {
      // pass id paramter to the router
      this.$router.push({ name: "createTask", params: { taskId: id } });
    },
  },
});

// Router instance
const router = new VueRouter({
  // Define web app routes
  routes: [
    { path: "/", name: "home", component: homepageVue },
    { path: "/login", name: "login", component: loginpageVue },
    { path: "/register", name: "register", component: registerpageVue },
    { path: "/yourTasks", name: "yourTasks", component: yourtasksVue },
    { path: "/yourTests", name: "yourTests", component: yourtestsVue },
    { path: "/createTask", name: "createTask", component: createtaskpageVue },
    { path: "/createTest", name: "createTest", component: createTestPageVue },
    { path: "/takeTest/:id", name: "takeTest", component: takeTestPageVue },

    {
      path: "/yourAssignments",
      name: "yourAssignments",
      component: yourAssignmentsVue,
    },

    {
      path: "/modifyTest/:id",
      name: "modifyTest",
      component: modifyTestPageVue,
    },
  ],
});

async function authorizeUserType(type) {
  if (!localStorage.getItem("token")) {
    return false;
  }

  try {
    let result = await userDataService.authorize(
      { typeToCheck: type },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log(result);
    return result.status == 200;
  } catch (err) {
    return false;
  }
}

router.beforeEach(async (to, from, next) => {
  let studentLogin = await authorizeUserType("student");
  let teacherLogin = await authorizeUserType("teacher");

  // Going to login
  if (to.name == "login") {
    next();
  } else if (
    // Student can access homepage, take a test, assignments
    studentLogin &&
    to.name != "yourAssignments" &&
    to.name != "home" &&
    to.name != "takeTest" &&
    to.name != "register"
  ) {
    // Return signed in user to homepage
    store.dispatch("showMessage", {
      message: "Unauthorized to view page!",
      success: false,
    });
    next({ name: "home" });
  } else if (
    // Teacher can go anywhere except take a test and assignemnts
    teacherLogin &&
    (to.name == "yourAssignments" || to.name == "takeTest")
  ) {
    // Return signed in user to homepage
    store.dispatch("showMessage", {
      message: "Unauthorized to view page!",
      success: false,
    });
    next({ name: "home" });
  } else if (!teacherLogin && !studentLogin && to.name != "register") {
    // Take user to login page if not signed in
    store.dispatch("showMessage", {
      message: "Login to continue!",
      success: false,
    });
    next({ name: "login" });
  } else {
    // Go to desired page
    next();
  }
});

router.onError(async (to, from, next) => {
  return next({ name: "login" });
});

// Create new Vue app
new Vue({
  router,
  components: {
    Navbar,
  },
  methods: {},
  vuetify,
  store: store,
  render: (h) => h(App),
}).$mount("#app");
