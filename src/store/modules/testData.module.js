/*****************************************************************
 * File: testData.module.js
 * Description: Stores data about current configuration when
 * creating a new Test of modifying an existing one
 *
 * Project: Bachelor's Thesis - Web system for Math tests creation
 * Author: xcziro00, David Czirok
 *
 * Last modified: 07-05-2022
 */

// imports
import categoryDataService from "../../services/categoryDataService";
import generatorService from "../../services/generatorService";
import taskDataService from "../../services/taskDataService";
import testDataService from "../../services/testDataService";

export default {
  namespaced: true,
  // Data section
  state: {
    id: 0,
    name: "",
    timeLimit: 15,

    grade: "0",
    grades: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],

    tasks: [],
    concreteTasks: [],
    taskCategories: [],
    answerOptions: ["text", "radio", "select", "checkbox"],

    selectedTasks: [],
    selectedTaskCategories: [],
    selectedAnswerOptions: [],

    stepCounter: 1,
  },

  // Internal state changers
  mutations: {
    START_TEST_CREATION(state, payload) {
      state.id = 0;
      state.name = "New Test";
      state.grade = "0";
      state.timeLimit = 15;
      state.categories = payload.categories;
      state.tasks = [];
      state.selectedTasks = [];
      state.concreteTasks = [];
      state.selectedTaskCategories = [];
      state.stepCounter = 1;
    },
    START_TEST_MODIFICATION(state, payload) {
      state.id = payload.id;
      state.name = payload.name;
      state.grade = payload.grade;
      state.timeLimit = payload.timeLimit;
      state.selectedTasks = payload.tasks;
      state.categories = payload.categories;
      state.stepCounter = 4;

      console.log("SET TO: ", state.timeLimit);
    },

    MOVE_TO_NEXT_STEP(state, payload) {
      state.stepCounter = payload.value;
    },
    MOVE_TO_PREV_STEP(state, payload) {
      state.stepCounter = payload.value;
    },

    SET_NAME(state, payload) {
      state.name = payload.name;
    },
    SET_GRADE(state, payload) {
      state.grade = payload.value;
    },
    SET_TIME_LIMIT(state, payload) {
      state.timeLimit = payload.timeLimit;
    },

    SET_SELECTED_CATEGORY(state, payload) {
      state.selectedTaskCategories.push(payload.category);
    },
    REMOVE_SELECTED_CATEGORY(state, payload) {
      state.selectedTaskCategories.splice(payload.categoryIndex, 1);
    },

    SET_SELECTED_TASK(state, payload) {
      state.selectedTasks.push(payload.task);
      console.log("SELECTED: ", state.selectedTasks);
    },
    REMOVE_SELECTED_TASK(state, payload) {
      state.selectedTasks.splice(payload.index, 1);
      console.log("SELECTED: ", state.selectedTasks);
    },

    GET_TASKS(state, payload) {
      state.tasks = payload.tasks;
    },

    SET_CONCRETE_TASKS(state, payload) {
      state.concreteTasks = payload.concreteTasks;
      console.log("generated concrete tasks", state.concreteTasks);
    },
    REMOVE_CONCRETE_TASK(state, payload) {
      state.concreteTasks.splice(payload.index, 1);
    },

    SET_RENDER_OPTION_TO_CONCRETE_TASK(state, payload) {
      if (payload.index < state.concreteTasks.length) {
        state.concreteTasks[payload.index].renderOption = payload.renderOption;
      }
    },
  },

  // Events, event handlers
  actions: {
    startTestCreation(context) {
      categoryDataService.getAll().then((categories) => {
        let payload = {
          categories: categories.data.map((category) => {
            return {
              id: category.id,
              name: category.name,
            };
          }),
        };
        context.commit("START_TEST_CREATION", payload);
      });
    },

    // Modify was clicked from the Your tests table
    async startTestModification(context, payload) {
      // Fetch test from database
      let test = await testDataService.get(payload.testId);
      let categories = await categoryDataService.getAll();

      console.log("MOVING TO MODIFY", test.data.tasks);

      // Prepare test data
      let testData = {
        id: test.data.id,
        name: test.data.name,
        grade: test.data.grade,
        timeLimit: test.data.timeLimit,
        // Set task properties
        tasks: test.data.tasks.map((task) => {
          return {
            id: task.id,
            name: task.name,
            content: task.content,
            renderOption: task.testTasks.renderOption,
          };
        }),
        // Set categories
        categories: categories.data.map((category) => {
          return {
            id: category.id,
            name: category.name,
          };
        }),
      };
      // Set test data
      context.commit("START_TEST_MODIFICATION", testData);
      context.dispatch("generateConcreteTasks");
    },

    // Move to next step
    moveToNextStep(context) {
      let stepCounter = context.state.stepCounter + 1;
      context.commit("MOVE_TO_NEXT_STEP", { value: stepCounter });
    },

    // Move to next step
    moveToPrevStep(context) {
      let stepCounter =
        context.state.stepCounter == 1 ? 1 : context.state.stepCounter - 1;
      context.commit("MOVE_TO_NEXT_STEP", { value: stepCounter });
    },

    setName(context, payload) {
      context.commit("SET_NAME", payload);
    },

    // Set selected grade
    setGrade(context, payload) {
      let grade = context.state.grade == payload.value ? "0" : payload.value;
      context.commit("SET_GRADE", { value: grade });
    },

    // Set time limit
    setTimeLimit(context, payload) {
      context.commit("SET_TIME_LIMIT", payload);
    },

    // Set selected category
    setSelectedCategory(context, payload) {
      let categories = context.state.selectedTaskCategories;
      // Check if category is already selected
      let categoryIndex = categories.findIndex(
        ({ id }) => payload.category.id === id
      );

      // Set or remove from selected categories
      if (categoryIndex == -1) {
        context.commit("SET_SELECTED_CATEGORY", payload);
      } else {
        context.commit("REMOVE_SELECTED_CATEGORY", { categoryIndex });
      }
    },

    // Set selected task for test
    setSelectedTask(context, payload) {
      // Find index in array
      let taskId = payload.task.id;
      let tasks = context.state.selectedTasks;
      let taskIndex = tasks.findIndex(({ id }) => taskId === id);

      if (taskIndex == -1) {
        // Save selected abstractTask
        context.commit("SET_SELECTED_TASK", payload);
      } else {
        context.commit("REMOVE_SELECTED_TASK", { index: taskIndex });
      }
    },

    // Populate the concreteTasks array with generated abstractTasks
    generateConcreteTasks(context) {
      console.log("GENERATING...");

      generatorService
        .generateMultiple({
          abstractTasks: context.state.selectedTasks,
        })
        .then((response) => {
          let updatedConcreteTasks = [];

          // Check if concreteTask is already in the array
          for (let concreteTask of response.data.concreteTasks) {
            // Find concreteTask in array
            let foundInArray = context.state.concreteTasks.find(
              ({ abstractTaskId }) =>
                concreteTask.abstractTaskId == abstractTaskId
            );

            if (!foundInArray) {
              // Add to updatedConcreteTasks
              updatedConcreteTasks.push(foundInArray);
            } else {
              // Update Content (but save)
              foundInArray.content = concreteTask.content;
            }
          }

          console.log("CONCRETE TASKS GOT BACK: ", response.data.concreteTasks);

          let payload = { concreteTasks: response.data.concreteTasks };
          context.commit("SET_CONCRETE_TASKS", payload);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // Set render options to concrete Tasks
    setRenderOption(context, payload) {
      context.commit("SET_RENDER_OPTION_TO_CONCRETE_TASK", payload);
    },

    // Removes selected concreteTask
    removeConcreteTask(context, payload) {
      // Find indexes of concreteTask and abstractTask
      let concreteTaskIndex = context.state.concreteTasks.findIndex(
        ({ abstractTaskId }) => payload.index == abstractTaskId
      );
      let abstractTaskIndex = context.state.selectedTasks.findIndex(
        ({ id }) => payload.index == id
      );

      // Remove selected concreteTask and abstractTask from their arrays
      context.commit("REMOVE_SELECTED_TASK", { index: abstractTaskIndex });
      context.commit("REMOVE_CONCRETE_TASK", { index: concreteTaskIndex });
    },

    // Load task from database by category
    async getTasks(context) {
      console.log("DOWNLOADING TASKS");

      taskDataService
        .findAllMatching({
          grade: context.state.grade,
          categories: context.state.selectedTaskCategories.map(
            ({ name }) => name
          ),
        })
        .then((response) => {
          console.log(response.data);

          let payload = {
            // Map task properties
            tasks: response.data.map((task) => {
              return {
                id: task.id,
                name: task.name,
                content: task.content,
                renderOption: "text", // set default render option
              };
            }),
          };

          context.commit("GET_TASKS", payload);

          for (let task of payload.tasks) {
            context.dispatch("setSelectedTask", { task });
            context.dispatch("setSelectedTask", { task });
          }

          context.dispatch("generateConcreteTasks");
        });
    },
  },
  // Outputs
  getters: {
    isCategorySelected: (state) => (selected_id) => {
      return (
        state.selectedTaskCategories.find(({ id }) => id === selected_id) !=
        undefined
      );
    },

    isTaskSelected: (state) => (selected_id) => {
      return (
        state.selectedTasks.find(({ id }) => id === selected_id) != undefined
      );
    },
  },
};
