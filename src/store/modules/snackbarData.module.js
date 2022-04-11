export default {
  // Data
  state: {
    visible: false,
    success: true,
    message: "",
  },

  mutations: {
    // Show message in top section of screen
    SHOW_MESSAGE(state, payload) {
      state.message = payload.message ?? "Text";
      state.success = payload.success ?? true;
      state.visible = true;
      console.log("snackbar active");
    },

    // Explicitly hides hides the message
    HIDE_MESSAGE(state) {
      state.visible = false;
    },
  },

  actions: {
    showMessage(context, payload) {
      context.commit("SHOW_MESSAGE", payload);
    },

    hideMessage(context) {
      context.commit("HIDE_MESSAGE");
    },
  },
  getters: {},
};
