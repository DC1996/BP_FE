<template>

    <!-- Show step completion and content of each step -->
    <v-stepper v-model="$store.state.test.stepCounter" class="px-2 mt-6 mx-14 b-g" style="height: calc(100% - 2.5rem);">

    <!-- Steps at the top -->
    <v-stepper-header class="mx-6 mt-2 pa-0 elevation-0">
      <v-stepper-step :complete="$store.state.test.stepCounter > 1" step="1"> Select grade </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="$store.state.test.stepCounter > 2" step="2"> Select category </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="$store.state.test.stepCounter > 3" step="3"> Select tasks </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="$store.state.test.stepCounter > 4" step="4"> Configure tasks </v-stepper-step>
    </v-stepper-header>

    <!-- Content of each step -->
    <v-stepper-items style="height: 100%">

      <!-- Select task grade from given list -->
      <v-stepper-content step="1" style="height: calc(100%-2rem)">
        <v-container fluid class="">
            <v-row align="center" justify="center">
                <v-col align="center" justify="center" cols="4" v-for="(grade, i) in $store.state.test.grades" :key="i">
                    <v-badge :value="$store.state.test.grade == grade" color="primary" icon="mdi-check" overlap>
                        <!-- Applies style when given grade was selected, disables other grades, set grade on click -->
                        <v-hover v-slot="{ hover }">
                          <v-card
                              class="py-6 px-12"
                              :outlined="$store.state.test.grade != grade && hover"
                              :elevation="$store.state.test.grade == grade ? 2 : 0"
                              :plain="$store.state.test.grade != '0' || $store.state.test.grade != grade"
                              :disabled="$store.state.test.grade != '0' && $store.state.test.grade != grade" 
                              :class="{ 'my-n1': $store.state.test.grade != grade && hover }"
                              @click="setGrade({value: grade})">
                              <h4> {{ grade }}. grade </h4>
                          </v-card>
                        </v-hover>
                    </v-badge>
                </v-col>
            </v-row>
            
            <!-- Action buttons -->
            <v-row class="d-flex justify-end pa-2 px-6 mt-2">
              <v-btn 
                @click="populateDatabase()"
                class="my-2 mx-2 align-self-end no-uppercase" text> 
                Cancel 
              </v-btn>
              <v-btn 
                :disabled="$store.state.test.grade == '0'" 
                class="my-2 align-self-end no-uppercase" color="primary"
                @click="moveToNextStep()"> 
                Continue 
              </v-btn>
            </v-row>
        </v-container>

      </v-stepper-content>

      <!-- Select task categories from list -->
      <v-stepper-content step="2" style="height: calc(100% - 6rem);">
        <v-container fluid class="d-flex flex-column justify-end ma-0" style="height: 100%; width: 100%">
          
          <!-- Categories -->
          <v-row>
            <v-col align="center" justify="center" cols="4" v-for="(category, i) in $store.state.test.categories" :key="i">
              <v-badge :value="isCategorySelected(category.id)" color="primary" icon="mdi-check" overlap>
                  <v-card @click="setSelectedCategory({ category: category })" class="pa-4 d-flex justify-center align-center" style="width: 150px; height: 75px">
                      <h4> {{ category.name }} </h4>
                  </v-card>
              </v-badge>
            </v-col>
          </v-row>

          <!-- Action buttons-->
          <v-row class="d-flex justify-end pa-2 px-6 mt-2">
            <v-btn outlined text class="my-2 mx-2 align-self-end no-uppercase" @click="moveToPrevStep()"> 
              Back 
            </v-btn>
            <v-btn 
              :disabled="$store.state.test.selectedTaskCategories.length == 0"
              class="my-2 align-self-end no-uppercase" color="primary"
              @click="getTasks(); moveToNextStep();">
              Continue 
            </v-btn>
          </v-row>
        </v-container>

      </v-stepper-content>

      <!-- Select task from the list -->
      <v-stepper-content step="3">

        <!-- Tasks -->
        <p class="mx-7" v-if="$store.state.test.tasks.length == 0"> 
          No tasks found for selected grade and categories. 
        </p>
        <v-container class="d-flex flex-column" v-if="$store.state.test.tasks.length != 0">
          <v-badge 
            v-for="(task, index) in $store.state.test.tasks" :key="index"
            :value="isTaskSelected(task.id)" color="primary" icon="mdi-check" overlap>
            <v-card @click="setSelectedTask({ task })" class="px-4">
              <h4 class="py-1 pt-3"> {{ task.name }} </h4>
              <p class="pb-3"> {{ task.content.slice(0, 64)+"..." }} </p>
          </v-card>
          </v-badge>
        </v-container>

        <!-- Action buttons -->
        <v-row class="d-flex justify-end pa-2 px-6 mt-2 no-uppercase">
          <v-btn 
            outlined text class="my-2 mx-2 align-self-end no-uppercase"
            @click="moveToPrevStep()"> Back </v-btn>
          <v-btn :disabled="$store.state.test.tasks.length == 0"
            class="my-2 align-self-end no-uppercase" color="primary" 
            @click="generateConcreteTasks(); moveToNextStep()">
            Continue 
          </v-btn>
        </v-row>

      </v-stepper-content>

      <!-- See preview of each task, modify render options -->
      <v-stepper-content step="4">
        <v-container class="d-flex flex-column">
          <p class="text-h4 align-self-center"> 
            {{ $store.state.test.name }} 
          </p>

          <!-- Time for task -->
          <v-card outlined width="max-content" class="d-flex flex-row mx-6 my-2 px-6 align-center">
            <p class="ma-0 py-2"> Grade: {{ $store.state.test.grade }}. </p>
          </v-card>
          <v-card outlined class="d-flex flex-row justify-start mx-6 my-2 px-6 py-6">
            <p class="ma-0 py-2 text-body-1" style="width: 12.5rem"> 
              Test duration: <span class="font-weight-medium text-subtitle-1">
                {{ $store.state.test.timeLimit }}</span> minutes 
            </p> 
            <v-slider 
              class="d-flex align-center ma-0" hide-details 
              v-model="$store.state.test.timeLimit" :min="5" :max="45" @change="setTimer">
            </v-slider>
          </v-card>

          <!-- Cards with task details, render options preview -->
          <v-card v-for="(task, tIndex) in $store.state.test.concreteTasks"
            :key="tIndex" class="my-2 mx-6 px-3">
            <!-- Task name -->
            <v-card-title class="d-flex justify-space-between text-h5 font-weight-medium">
              {{ tIndex + 1 }}) Task
              <!-- Task options -->
              <v-card-actions>
                <!-- Edit asnwer type button -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn 
                      @click="selectedTaskId = tIndex; selectedAnswerType = answerTypes.findIndex((option) => option == task.renderOption); setAnswerOptionDialog = true"
                      icon v-bind="attrs" v-on="on">
                      <v-icon color="primary"> mdi-tune </v-icon>
                    </v-btn>
                  </template>
                  <span class="font-weight-light">Edit answer type</span>
                </v-tooltip>
                <!-- Modify task button -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn @click="modifyTask(task.abstractTaskId)" icon v-bind="attrs" v-on="on">
                      <v-icon color="var(--main-text-color)">
                        mdi-pencil-outline
                      </v-icon>
                    </v-btn>
                  </template>
                  <span class="font-weight-light">Edit task</span>
                </v-tooltip>
                <!-- Remove concrete task -->
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn 
                      @click.stop="selectedTaskId = task.abstractTaskId; removeDialog = true"
                      icon v-bind="attrs" v-on="on">
                      <v-icon color="error">
                        mdi-close-circle-outline
                      </v-icon>
                    </v-btn>
                  </template>
                  <span class="font-weight-light">Remove task</span>
                </v-tooltip>
              </v-card-actions>
            </v-card-title>
            
            <!-- Task text -->
            <v-card-subtitle class="mt-1 text-body-1">
              <p> {{ task.content.text }} </p>
            </v-card-subtitle>
            
            <!-- Task questions, answers -->
            <v-card-text>
              <div 
                class="d-flex flex-column justify-center align-start"  
                v-for="(question, i) in task.content.questions" :key="i">

                <!-- Question -->
                <div class="d-flex flex-row justify-flex-start align-center">
                  <p class="font-weight-bold align-self-center ma-0 mt-2 text-subtitle-1"> 
                    <span class="font-weight-medium text-body-1"> {{ i+1 }}. Question </span><br>
                    {{ question.text.replace(/@.+/, '') }}
                  </p>
                </div>

                <!-- Answers -->
                <!-- type == 'select' -->
                <div v-if="task.renderOption == 'select'"
                  class="d-flex flex-row justify-space-between mb-1"> 
                  <!-- Answer options -->
                  <div v-for="(answer, index) in question.answers" :key="index"
                    class="d-flex flex-column py-4">
                      <v-select style="max-width: 200px"
                        dense :items="answer.options" 
                        label="Answer" outlined>
                      </v-select>
                  </div>
                </div>

                <!-- type == 'radio' -->
                <div class="d-flex flex-row justify-space-between mb-1" v-if="task.renderOption == 'radio'">  
                  <div class="d-flex flex-column" v-for="(answer, index) in question.answers" :key="index">
                    <v-radio-group readonly v-model="placeholderModel">
                      <v-radio dense class="py-1"
                        v-for="(value, i) in answer.options"
                        :key="value.toString() + i" :label="value.toString()" :value="i">
                      </v-radio>
                    </v-radio-group>
                  </div>
                </div>

                <!-- type == 'checkbox' -->
                <div class="d-flex flex-row justify-space-between mb-1" v-if="task.renderOption == 'checkbox'"> 
                  <div class="d-flex flex-column py-1 px-2" v-for="(answer, index) in question.answers" :key="index">
                    <p> {{ answer.name }} </p>
                      <v-checkbox dense class="pa-0 ma-0" 
                        v-for="(value, i) in answer.options"
                        :key="value.toString()" :label="value.toString()" :value="i">
                      </v-checkbox>
                  </div>
                </div>

                <!-- type == 'text' -->
                <div class="d-flex flex-row justify-space-between mb-1" v-if="task.renderOption == 'text'">
                  <div class="dflex flex-column py-1 mr-2" v-for="(answer, index) in question.answers" :key="index">
                      <v-text-field dense label="Answer" outlined></v-text-field>
                  </div>
                </div>

              </div>
            </v-card-text>
          </v-card>
        </v-container>

        <!-- Action buttons -->
        <v-row class="d-flex justify-center align-center pa-2 px-6 mt-2">
          <v-btn outlined text class="my-2 mb-4 mx-2 align-self-end no-uppercase"
            @click="moveToPrevStep()"> 
            Back 
          </v-btn>
          <v-btn class="my-2 mb-4 mx-2 align-self-end no-uppercase" color="primary" 
            @click="saveDialog = true"> 
            Finish
          </v-btn>
        </v-row>

        <!-- Remove task from test dialog -->
        <v-dialog v-model="removeDialog" width="350" :retain-focus="false">
          <v-card>
            <v-card-title class="text-h5 lighten-2"> Remove Task </v-card-title>

            <v-card-text> Are you sure you want to remove this task? </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-btn color="black" class="no-uppercase" outlined text @click="removeDialog = false"> Cancel </v-btn>
              <v-btn class="no-uppercase" color="red" @click="removeConcreteTask({index: selectedTaskId}); removeDialog = false"> Remove </v-btn>
            </v-card-actions> 
          </v-card>
        </v-dialog>

        <!-- Answer Type Options Dialog -->
        <v-dialog v-model="setAnswerOptionDialog" width="500" :retain-focus="false">
          <v-card>
              <v-card-title class="text-h5 lighten-2">
                Task #{{selectedTaskId+1}} Answer Options
              </v-card-title>

              <v-card-text> 
                <p>Select answer type</p>
                <v-slider 
                  v-model="selectedAnswerType" 
                  :tick-labels="answerTypes" :max="3"
                  step="1" ticks="always" tick-size="6"
                  >
                </v-slider>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn class="no-uppercase" color="black" outlined text @click="setAnswerOptionDialog = false"> Back </v-btn>
                  <v-btn class="no-uppercase" color="primary"
                    @click="setRenderOption({index: selectedTaskId, renderOption: answerTypes[selectedAnswerType]}); setAnswerOptionDialog = false"> 
                    Save 
                  </v-btn>
              </v-card-actions>
              
          </v-card>
        </v-dialog>

        <!-- Answer type options dialog -->
        <v-dialog v-model="saveDialog" width="450" :retain-focus="false">
            <v-card class="d-flex flex-column rounded-lg pt-2">
                <v-form v-model="testOk">
                <p class="pb-4 mt-2 mb-0 mx-4 font-weight-medium text-h5 align-self-center"> Test Details Overview </p>

                <!-- Set task name -->
                <v-text-field 
                    class="px-4" v-model="testName" outlined hide-details="auto"
                    label="Test name" :rules="testNameRule" placeholder="Enter test name">
                </v-text-field>

                <v-container class="d-flex flex-row pa-0 py-2 my-3 mx-0">
                  <!-- Selected grade -->
                  <v-text-field
                      class="px-4" v-model="$store.state.test.grade" outlined readonly hide-details=""
                      label="Grade">
                  </v-text-field>

                  <!-- Selected time limit -->
                  <v-text-field
                      class="px-4" v-model="$store.state.test.timeLimit" outlined readonly hide-details=""
                      label="Time limit">
                  </v-text-field>
                </v-container>
                

                <!-- Set categories to task -->
                <v-combobox class="px-4" label="Categories" 
                    v-model="selectedTaskCategories"
                    readonly multiple chips outlined>
                    <template v-slot:selection="data">
                        <v-chip color="primary" class="pa-2" v-bind="data.attrs">
                          {{ data.item }}
                        </v-chip>
                    </template>
                </v-combobox>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="no-uppercase" color="black" outlined text @click="saveDialog= false"> Cancel </v-btn>
                    <v-btn class="no-uppercase" color="primary" :loading="loading" :disabled="!testOk" @click="createOrSaveTest()"> Save </v-btn>
                </v-card-actions>
            </v-form>    
          </v-card>
        </v-dialog>

      </v-stepper-content>

    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import TestDataService from '../services/testDataService';

export default {
    data() {
        return {
            // stepper completion and list items on each page
            selectedTaskId: -1,
            timer: 15,

            // task handling
            tasks: [],
            concreteTasks: [],
            categories: [],

            // answer types and rendering
            answerTypes: [ 'text', 'radio', 'select', 'checkbox' ],
            answerOptions: [],
            selectedAnswerType: 'text',
            setAnswerOptionDialog: false,

            // remove task dialog
            removeDialog: false,
            
            placeholderModel: 0,
            saveDialog: false,

            testOk: false,
            testNameRule: [
              v => !!v || "Test name cannot be empty!"
            ],

            loading: false,
        }
    },

    methods: {

        // function from testData Vuex store 
        ...mapActions({
          setName: 'test/setName',
          setGrade: 'test/setGrade',
          setTimeLimit: 'test/setTimeLimit',
          setTestName: 'test/setTestName',
          setSelectedCategory: 'test/setSelectedCategory',
          setSelectedTask: 'test/setSelectedTask',
          moveToNextStep: 'test/moveToNextStep',
          moveToPrevStep: 'test/moveToPrevStep',
          getTasks: 'test/getTasks',
          generateConcreteTasks: 'test/generateConcreteTasks',
          setRenderOption: 'test/setRenderOption',
          removeConcreteTask: 'test/removeConcreteTask'
        }),

        setTestName() {
            this.setName({name: this.testName});
        },

        // Create new test and add selected tasks || Update existing test
        createOrSaveTest() {

          this.loading = true;

          this.setTestName();

          try{

            if( this.$store.state.test.id == 0 ) {
              // Create a new test
              TestDataService.create({
                name: this.testName, 
                grade: this.$store.state.test.grade,
                timeLimit: this.$store.state.test.timeLimit, 
                createdBy: this.$store.state.app.userID }
              )
              .then(async (response) => {
                let testId = response.data.id;

                // Add each selected to the test
                for(let task of this.$store.state.test.concreteTasks) {
                  await TestDataService.addTask({
                    testId: testId,
                    taskId: task.abstractTaskId,
                    taskRenderOption: task.renderOption
                  });
                }
                
                // Return to test list with success message
                this.loading = false;
                this.saveDialog = false;
                this.$router.push({ name: "yourTests" });
                this.$store.dispatch('showMessage', {message: 'Test created successfuly!'});
              });
            } else {
              // Update an existing test
              TestDataService.update(this.$store.state.test.id, {
                name: this.$store.state.test.name, 
                grade: this.$store.state.test.grade,
                timeLimit: this.$store.state.test.timeLimit,
              }).then(() => {
                // Get abstractTest by ID
                TestDataService.get(this.$store.state.test.id).then(async (abstractTest) => {
                  // Remove current tasks
                  for(let abstractTask of abstractTest.data.tasks) {
                    await TestDataService.removeTask({ testId: abstractTest.data.id, taskId: abstractTask.id });
                  }

                  // Add updated tasks to test
                  for(let task of this.$store.state.test.concreteTasks) {
                    await TestDataService.addTask({
                      testId: abstractTest.data.id,
                      taskId: task.abstractTaskId,
                      taskRenderOption: task.renderOption
                    });
                  }

                  // Return to test list with a success message
                  this.loading = false;
                  this.saveDialog = false;
                  this.$router.push({ name: "yourTests" });
                  this.$store.dispatch('showMessage', {message: 'Test successfuly updated!'});
                });
              });
            }
        } catch(err) {
          this.loading = false;
          this.saveDialog = false;
          this.$store.dispatch('showMessage', {message: 'Error while saving test!', success: false});
        }
      },

      setTimer(value) {
        this.setTimeLimit({ timeLimit: value });
      }
    },

    // This function runs before the UI loads
    beforeRouteEnter (to, from, next) {
        // Load categories and tasks from the database
        next( async vm => { vm.getTasks(); });
    },

    computed: {
      ...mapGetters({
        isCategorySelected: 'test/isCategorySelected',
        isTaskSelected: 'test/isTaskSelected',
        getCategories: 'test/getCategories'
      }),
      
      testName: {
        get () {
          return this.$store.state.test.name;
        },
        set (value) {
          this.$store.commit('test/SET_NAME', {name: value});
        }
      },

      taskCategories: {
        get () {
          return this.$store.state.test.categories.map(({name}) => name);
        },
      },

      selectedTaskCategories: {
        get () {
          return this.$store.state.test.selectedTaskCategories.map(({name}) => name);
        },
        set (value) {
          this.$store.commit('test/SET_SELECTED_CATEGORY', 
            {category: this.$store.state.test.categories.find(({name}) => name == value)}
          );
        }
      }
    }
}
</script>

<style></style>