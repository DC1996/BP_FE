export default {
  // Shared variables across application
  state: {
    loggedIn: true,
    userID: null,
    loginType: "",
    token: null,

    takeTest: {
      taskCounter: 0,
    },
  },
  mutations: {
    SET_LOGGED_IN(state, payload) {
      state.loggedIn = payload.loggedIn;
      state.userID = payload.userID;
    },
    SET_LOGIN_TYPE(state, payload) {
      state.loginType = payload.loginType;
    },
    SET_TOKEN(state, payload) {
      state.token = payload.token;
    },
    UNSET_TOKEN(state) {
      state.token = null;
    },
  },
  actions: {
    setLoggedIn(context, payload) {
      context.commit("SET_LOGGED_IN", payload);
    },
    setLoginType(context, payload) {
      context.commit("SET_LOGIN_TYPE", payload);
    },
    setToken(context, payload) {
      context.commit("SET_TOKEN", payload);
    },
    unsetToken(context) {
      context.commit("UNSET_TOKEN");
    },
  },
  getters: {},
};
