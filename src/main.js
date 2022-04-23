import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import Navbar from "./components/Navbar.vue";
import homepageVue from "./components/pages/homepage.vue";
import yourtasksVue from "./components/yourtasks.vue";
import yourtestsVue from "./components/yourtests.vue";
import createtaskpageVue from "./components/createtaskpage.vue";
import createTestPageVue from "./components/createTestPage.vue";
import loginpageVue from "./components/pages/loginpage.vue";
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

// MathJax
import VueMathjax from "vue-mathjax";
import viewStudentsResultsVue from "./components/pages/viewStudentsResults.vue";
Vue.use(VueMathjax);

// Allow access to components
Vue.use(store);
Vue.use(Vuetify);
Vue.use(VueRouter);
Vue.use(globalSnackbar);
Vue.use(App);
Vue.use(Navbar);
Vue.use(loginpageVue);
Vue.use(registerpageVue);
Vue.use(viewStudentsResultsVue);
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
    // Transform timestamp to readable format
    getHumanReadableTimestamp(timestamp) {
      console.log("TIME:", timestamp);

      let [date, time] = timestamp.split(" ");

      let [year, month, day] = date.split("-");
      let [hours, minutes] = time.split(":", 2);

      return `${day[0] == "0" ? day[1] : day}.${
        month[0] == "0" ? month[1] : month
      }.${year} ${hours}:${minutes}`;
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
      path: "/viewStudentResults/:id",
      name: "viewStudentResults",
      component: viewStudentsResultsVue,
    },

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
  // Load save user type
  let userType = store.state.app.loginType;
  let loggedIn = await authorizeUserType(userType ?? "");

  console.log("LOGIN: ", loggedIn, userType);

  // Going to login
  if (to.name == "login") {
    if (loggedIn == true) {
      // Return signed in user to homepage
      store.dispatch("showMessage", {
        message: "Already logged in!",
      });
      next({ name: "home" });
    }
    next();
  } else if (
    // Student can access homepage, take a test, assignments
    loggedIn &&
    userType == "student" &&
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
    loggedIn &&
    userType == "teacher" &&
    (to.name == "yourAssignments" || to.name == "takeTest")
  ) {
    // Return signed in user to homepage
    store.dispatch("showMessage", {
      message: "Unauthorized to view page!",
      success: false,
    });
    next({ name: "home" });
  } else if (!loggedIn && to.name != "register" && to.name != "login") {
    // Take user to login page if not signed in
    store.dispatch("showMessage", {
      message: "Login to continue to this page!",
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
