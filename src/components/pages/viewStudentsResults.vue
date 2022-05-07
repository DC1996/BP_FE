<!-- 
 * File: viewStudentResults.vue
 * Description: Implements view students results page and functions
 *
 * Project: Bachelor's Thesis - Web system for Math tests creation
 * Author: xcziro00, David Czirok
 *
 * Last modified: 07-05-2022
 -->
<template>
    <v-container 
        class="d-flex flex-column justify-start align-center mt-5 rounded-lg">

        <v-card elevation="0" class="ml-0">
            <v-card-title class="d-flex flex-row justify-space-between align-center">
            <h3 class="t-t-color text-h5 pt-3 font-weight-medium"> {{ testName }} </h3>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-text-field
                label="Search" append-icon="mdi-magnify" 
                v-model="search" single-line hide-details
            ></v-text-field>
            </v-card-title>
            
            <v-data-table
                :loading="loading" loading-text="Loading tests... Please wait"
                :headers="headers" :items="tests" :items-per-page="7" :search="search" width="80%">
                <template v-slot:item="row">
                    <tr>
                        <td> {{ row.item.studentName }} </td>

                        <td> {{ row.item.finishedAt ? getHumanReadableTimestamp(row.item.finishedAt) : '---' }} </td>

                        <td>  {{ row.item.finishedAt ? row.item.result : '---' }} </td>

                        <td>
                        <v-btn 
                            plain class="pa-0 pr-7" 
                            :disabled="row.item.status == 'Handed Out'" 
                            :ripple="false" @click.stop="showResults(row.item)">
                            <v-icon class="pl-7" color="primary">
                                mdi-file-eye-outline
                            </v-icon>
                        </v-btn>
                        </td>
                    </tr>
                </template>

        </v-data-table>

        </v-card>

        <v-dialog v-model="showResult" width="750">
            <v-card>

                <v-card-title class="text-h5 lighten-2 mb-3"> Results: {{ testName }} </v-card-title>
                
                <div class="d-flex flex-row align-center">
                    <v-progress-circular 
                        :rotate="360" :size="100" :width="15" :value="calculatedPercentage" 
                        :color="getGraphColor(calculatedPercentage)" class="mx-6 mb-2">
                        <p class="text-body-1 font-weight-bold pa-0 ma-0">{{ calculatedPercentage }}</p>
                    </v-progress-circular>
                    <div class="d-flex flex-column justify-start">                
                        <v-card-text class="text-body-1 my-0 py-0 font-weight-bold"> 
                            {{ test.studentName }} 
                        </v-card-text>
                        <v-card-text class="text-body-1"> 
                            Overall score: 
                            <span class="font-weight-bold" :style="{'color': getGraphColor(calculatedPercentage)}"> 
                                {{ calculatedPercentage }} 
                            </span> <br>
                            Correct answers: 
                                <span class="font-weight-bold"> 
                                    {{ calculatedFraction.correct }} / {{ calculatedFraction.total }}
                                </span>
                        </v-card-text>
                    </div>
                </div>

                <v-card v-for="(task, tIndex) in test.content" :key="tIndex" outlined class="my-2 mx-6 px-3">
                    <!-- Task name -->
                    <v-card-title class="d-flex justify-space-between text-h6 font-weight-medium">
                        {{ tIndex + 1 }}) Task
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
                        <p
                            class="font-weight-black align-self-center ma-0 text-subtitle-1"> 
                            <span class="font-weight-medium text-body-1"> Question #{{ i+1 }}: </span><br>
                            {{ question.text.replace(/@.+/, '') }}
                        </p>
                        </div>

                        <!-- Answers -->
                        <!-- type == 'select' -->
                        <div v-if="task.renderOption == 'select'"
                        class="d-flex flex-row justify-space-between mb-1"> 
                            <!-- Answer options -->
                            <div v-for="(answer, optIndex) in question.answers" :key="optIndex"
                                class="d-flex flex-column py-1">
                                <v-select readonly
                                    dense :items="answer.options" 
                                    :value="test.content[tIndex].content.questions[i].answers[optIndex].selected" label="Answer" outlined>
                                </v-select>
                            </div>
                        </div>

                        <!-- type == 'radio' -->
                        <div class="d-flex flex-row justify-space-between mb-1" v-if="task.renderOption == 'radio'">  
                            <div class="d-flex flex-column py-1 px-2" v-for="(answer, optIndex) in question.answers" :key="optIndex">
                                <v-radio-group readonly v-model="test.content[tIndex].content.questions[i].answers[optIndex].selected">
                                <v-radio dense class="py-1"
                                    v-for="(value, r_i) in answer.options" :value="value"
                                    :key="r_i" :label="value.toString()">
                                </v-radio>
                                </v-radio-group>
                            </div>
                        </div>

                        <!-- type == 'checkbox' -->
                        <div class="d-flex flex-row justify-space-between mb-1" v-if="task.renderOption == 'checkbox'"> 
                            <div class="d-flex flex-column py-1 px-2" v-for="(answer, optIndex) in question.answers" :key="optIndex">
                                <v-checkbox dense readonly class="pa-0 ma-0" v-for="(value) in answer.options"
                                    :key="value" :label="value.toString()" v-model="test.content[tIndex].content.questions[i].answers[optIndex].selected">
                                </v-checkbox>
                            </div>
                        </div>

                        <!-- type == 'text' -->
                        <div class="d-flex flex-row justify-space-between mb-1" v-if="task.renderOption == 'text'"> 
                            <div class="dflex flex-column py-1 mr-4" v-for="(answer, optIndex) in question.answers" :key="optIndex">
                                <v-text-field dense readonly
                                    label="Answer"
                                    v-model="test.content[tIndex].content.questions[i].answers[optIndex].selected"
                                    outlined
                                ></v-text-field>
                            </div>
                        </div>

                    </div>
                    </v-card-text>
                </v-card>

                <v-divider></v-divider>

                <v-card-actions>
                
                <v-spacer></v-spacer>
                
                <v-btn color="black" outlined text @click="showResult = false">
                    Close
                </v-btn>
                
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
import concreteTestDataService from '../../services/concreteTestDataService';
import testDataService from '../../services/testDataService';
    export default {
        data() {
            return {
                search: "",
                headers: [
                    { text: "Student", value: "studentName", width: "45ch" },
                    { text: "Finished", value: "finishedAt", width: "35ch" },
                    { text: "Result", value: "result", width: "25ch" },
                    { text: "Details", value: "details", align: "center", sortable: false, width: "15ch" },
                ],

                testName: "",
                tests: [],
                loading: false,

                calculatedPercentage: '',
                calculatedFraction: '',

                test: { user: { name: '', surname: ''}},
                showResult: false,
            };
        },

        methods: {
            // Get results
            async getResults(id) {
                try {
                    let results = await concreteTestDataService.getResults(id);
                    this.calculatedPercentage = results.data.percentage;
                    this.calculatedFraction = { correct: results.data.correct, total: results.data.total };
                } catch(err) {
                    this.$store.dispatch("showMessage", { message: err.response.data.message, success: false });
                }
            },

            // Return color based on value
            getGraphColor(value) {
                let testScore = parseFloat(value); // return number from percentage

                console.log("%VALUE%", testScore);
                
                if( testScore >= 66.6 ) {
                    return 'primary';
                } else if ( testScore >= 33.3 ) {
                    return 'orange';
                } else {
                    return 'error';
                }
            },

            async showResults(test) {
                this.test = test;
                await this.getResults(test.id);
                this.showResult = true;
            },

            async getStudentScoreInPercentage(id) {
                let results = await concreteTestDataService.getResults(id);
                return results.data.percentage;
            },
            

            async retrieveTestResults() {

                try {
                    this.loading = true;
                    let tests = await testDataService.get(this.$route.params.id);

                    this.testName = tests.data.name;
                    this.tests = tests.data.created.map((test) => {
                        return {
                            id: test.id,
                            status: test.status,
                            content: test.content,
                            studentName: test.user.name + ' ' + test.user.surname,
                            finishedAt: test.finishedAt
                        }
                    });
                    for(let i = 0; i < this.tests.length; i++) {
                        if ( this.tests[i].finishedAt ) {
                            let result = await this.getStudentScoreInPercentage(this.tests[i].id);
                            this.tests[i].result = result;
                        }
                    }

                    this.loading = false;

                    console.log(tests.data);

                    console.log("--->", this.tests);
                }

                catch(err) {
                    this.loading = false;
                    this.$store.dispatch("showMessage", {message: err.response.data.message, success: false});
                }
            },
        },

        beforeMount() {
            this.retrieveTestResults();
        }
    }
</script>

<style> </style>