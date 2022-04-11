<template>
    <!-- See preview of each task, modify render options -->
    <v-container class="d-flex flex-column">
        <!-- Test name -->
        <p class="text-h4 align-self-center mt-2" @blur="setTestName($event)" contenteditable="true" > {{ testName }} </p>

        <v-card hover outlined class="my-2 mx-6" v-for="(task, t_index) in concreteTasks" :key="t_index">
        
        <v-card-title class="d-flex justify-space-between"> 
            Task #{{ t_index + 1 }} 
        <!-- buttons in top right corner on card -->
        <v-card-actions>
            <!-- Edit answer rendering type button -->
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn @click="selectedTaskNumber = t_index; setAnswerOptionDialog = true" icon v-bind="attrs" v-on="on">
                        <v-icon color="primary"> mdi-tune </v-icon>
                    </v-btn>
                </template>
                <span class="font-weight-light">Edit answer type</span>
            </v-tooltip>
            <!-- Edit task button -->
            <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn @click="modifyTask(task)" icon v-bind="attrs" v-on="on">
                <v-icon color="var(--main-text-color)">
                    mdi-pencil-outline
                </v-icon>
                </v-btn>
            </template>
            <span class="font-weight-light">Edit task</span>
            </v-tooltip>
            <!-- change task answer type -->
            <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
                <v-btn 
                @click.stop="selectedTaskNumber = t_index; removeDialog = true" 
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
        
        <v-card-subtitle class="mt-1 text-body-1"> <p> {{ task.content.text }} </p> </v-card-subtitle>
        
        <v-card-text>
            <div 
            class="d-flex flex-column justify-center align-start"  
            v-for="(q, q_i) in task.content.questions" :key="q_i">

            <!-- Question -->
            <div class="d-flex flex-row justify-flex-start align-center mb-2">
                <p class="font-weight-light align-self-center ma-0 pl-2 text-body-1"> 
                    <span class="font-weight-medium"> Question #{{ q_i+1 }} </span>
                    : {{ q.text }}
                </p>
            </div>

            <!-- Answers -->
            <!-- type == 'select' -->
            <div class="d-flex flex-row justify-space-between mb-1" v-if="answerOptions[t_index] == 'select'"> 
                <div class="d-flex flex-column py-1 px-2" v-for="(answer, index) in q.answers" :key="index">
                    <v-select :items="answer.correct.concat(answer.incorrect)" :label="answer.name" outlined dense></v-select>
                </div>
            </div>

            <!-- type == 'radio' -->
            <div class="d-flex flex-row justify-space-between mb-1" v-if="answerOptions[t_index] == 'radio'">  
                <div class="d-flex flex-column py-1 px-2" v-for="(answer, a_index) in q.answers" :key="a_index">
                <p> {{ answer.name }} </p>
                <v-radio-group>
                    <v-radio class="py-1"
                    v-for="(value, i) in answer.correct.concat(answer.incorrect)"
                    :key="value" :label="value.toString()" :value="i" dense>
                    </v-radio>
                </v-radio-group>
                </div>
            </div>

            <!-- type == 'checkbox' -->
            <div class="d-flex flex-row justify-space-between mb-1" v-if="answerOptions[t_index] == 'checkbox'"> 
                <div class="d-flex flex-column py-1 px-2" v-for="(answer, index) in q.answers" :key="index">
                <p> {{ answer.name }} </p>
                    <v-checkbox class="pa-0 ma-0" v-for="(value, i) in answer.correct.concat(answer.incorrect)"
                    :key="value" :label="value.toString()" :value="i" dense>
                    </v-checkbox>
                </div>
            </div>

            <!-- type == 'text' -->
            <div class="d-flex flex-row justify-space-between mb-1" v-if="answerOptions[t_index] == 'text'"> 
                <div class="dflex flex-column py-1 px-2" v-for="(answer, index) in q.answers" :key="index">
                    <v-text-field
                    :label="answer.name"
                    outlined dense hide-details
                    ></v-text-field>
                </div>
            </div>

            </div>
        </v-card-text>

    </v-card>

    <v-row class="d-flex justify-center align-center pa-2 px-6 mt-2">
        <v-btn outlined class="my-2 mb-4 mx-2 align-self-end" text> Cancel </v-btn>
        <v-btn class="my-2 mb-4 mx-2 align-self-end" color="primary" @click="createAndSaveTest()"> Finish & Save</v-btn>
    </v-row>

    <v-dialog v-model="removeDialog" width="350" :retain-focus="false">
            <v-card>
                <v-card-title class="text-h5 lighten-2"> Remove Task #{{selectedTaskNumber+1}} from test </v-card-title>

                <v-card-text> Are you sure you want to remove this task? </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="black" outlined text @click="removeDialog = false"> Cancel </v-btn>
                    <v-btn dark color="red" @click="removeTask(selectedTaskNumber)"> Delete </v-btn>
                </v-card-actions>
                
            </v-card>
        </v-dialog>


        <!-- Answer type options dialog -->
        <v-dialog v-model="setAnswerOptionDialog" width="500" :retain-focus="false">
            <v-card>
                <v-card-title class="text-h5 lighten-2"> Task #{{selectedTaskNumber+1}} answer options </v-card-title>

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
                    <v-btn color="black" outlined text @click="setAnswerOptionDialog = false"> Cancel </v-btn>
                    <v-btn dark color="primary" @click="setAnswerOption(selectedTaskNumber, selectedAnswerType)"> Save </v-btn>
                </v-card-actions>
                
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
import TaskDataService from "../services/taskDataService";
import CategoryDataService from "../services/categoryDataService";
import GeneratorService from "../services/generatorService";
import { parseMathLang } from "../myfiles/taskHandler";

import { initMathJax, renderByMathjax } from 'mathjax-vue';
import TestDataService from '../services/testDataService';

export default {
    data() {
        return {
            // stepper completion and list items on each page
            e1: 1,
            selectedGrade: [false,false,false,false,false,false,false,false,false,false],
            selectedCategory: [false,false,false,false,false,false,false,false,false,false],
            selectedTask: [false,false,false,false,false,false,false,false,false,false],
            selectedTaskNumber: -1,
            
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
            
            
            placeholderModel: [0,0,0,0,0,0],

            testName: 'Test name',
        }
    },
    methods: {
        setTestName(event) {
            this.testName = event.target.innerHTML;
        },

        // set Answer Type option
        setAnswerOption(i, option) {
          this.answerOptions.splice(i, 1, this.answerTypes[option]);
          this.setAnswerOptionDialog = false;
          this.selectedAnswerType = 'text';
          console.log(this.answerOptions[i])

          initMathJax({})

          function onMathJaxReady() {
            const el = document.getElementById("answers");
            renderByMathjax(el);
          }

          initMathJax({}, onMathJaxReady);
        },

        // remove selected task
        removeTask(i) {
          this.removeDialog = false;
          this.concreteTasks.splice(i, 1);
        },

        // choose from items in the list
        setSelected(selection, i) {
            selection.splice(i, 1, !selection[i]);
        },

        // setup mapping of tasks
        getDisplayTask(task) {
            return {
                id: task.id,
                name: task.name,
                content: task.content,
                last_mod: task.updatedAt,
                renderOption: task.testTasks.renderOption,
            };
        },

        // setup mapping of categories
        getDisplayCategory(category) {
            return {
                id: category.id,
                name: category.name
            };
        },

        async retrieveTestAndTasks() {
            const response = await TestDataService.get(this.$route.params.id);

            this.tasks = response.data.tasks.map(this.getDisplayTask);

            // Generate preview for each task that was loaded
              this.tasks.forEach(task => {
                let abstractTask = parseMathLang(task.content);

                GeneratorService.generate({content: abstractTask}).then((res) => {
                  // Save id of task and add to concreteTasks array
                  this.concreteTasks.push({id: task.id, content: res.data.content});
                  this.answerOptions.push(task.renderOption);

                  console.log(task.renderOption);
                })
              });
        },

        // get Categories from database
        retrieveCategories() {
          CategoryDataService.getAll()
            .then((response) => {
              this.categories = response.data.map(this.getDisplayCategory);
              console.log(response.data);
            })
            .catch((e) => {
              console.log(e);
            });
        },

        // Create new test and add tasks that the user selected
        createAndSaveTest() {
          TestDataService.create({name: "Test name"}).then((response) => {
            let testId = response.data.id;

            // Delete tasks in db
            TestDataService.deleteTasks().then(() => {
                // Add new tasks
                this.concreteTasks.forEach((task) => {
                    TestDataService.addTask({testId: testId, taskId: task.id})
                    .then((res) => {
                        console.log(res); 
                        this.$router.push({ name: "yourTests" });
                    });
                });
            });
          });
        },
    },

    // This function runs before the UI loads
    beforeMount() {
        // Load categories and tasks from the database
        this.retrieveCategories();
        this.retrieveTestAndTasks();
    },
    setup() {
        
    },
}
</script>