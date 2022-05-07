<!-- 
 * File: yourtests.vue
 * Description: Implements the your tests page and functions
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
            <h3 class="t-t-color text-h5 pt-3 font-weight-medium"> Your tests </h3>
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
                        <td>{{ row.item.name }}</td>
                        <td>{{ row.item.grade }}</td>
                        <td>{{ getHumanReadableTimestamp(row.item.last_mod) }}</td>

                        <td class="px-3">
                        <v-btn plain class="pa-0" :ripple="false" @click.stop="openHandOutDialog(row.item)">
                            <v-icon class="pa-0 ma-0" color="primary">
                                mdi-clipboard-arrow-up-outline
                            </v-icon>
                        </v-btn>
                        </td>
                        <td class="px-4">
                        <v-btn plain class="pa-1" :disabled="!wasHandedOut(row.item)" :ripple="false" @click="showTestResults(row.item)">
                            <v-icon color="var(--main-text-color)">
                                mdi-file-eye-outline
                            </v-icon>
                        </v-btn>
                        </td>
                        <td class="pl-8">
                        <v-btn plain class="mr-4" :ripple="false" @click="modifyTest(row.item)">
                            <v-icon color="var(--main-text-color)">
                                mdi-pencil-outline
                            </v-icon>
                        </v-btn>
                        </td>
                        <td class="px-0">
                        <v-btn plain class="pa-0" :ripple="false" @click.stop="showDeleteDialog(row.item)">
                            <v-icon class="pa-0" color="orange">
                                mdi-close-circle-outline
                            </v-icon>
                        </v-btn>
                        </td>                        
                    </tr>
                </template>

        </v-data-table>

        </v-card>

        <v-dialog v-model="deleteDialog" width="325">
            <v-card>
                <v-card-title class="text-h5 lighten-2"> Delete task? </v-card-title>

                <v-card-text>
                    Are you sure you want to delete this task?
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="black" text @click="deleteDialog = false">
                    Cancel
                </v-btn>
                <v-btn color="red" text @click="deleteTest(selectedTestID)">
                    Delete
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="handoutDialog" width="550">
            <v-card>
                <v-card-title class="text-h5 lighten-2"> Hand Out Test </v-card-title>

                <v-card-text class="text-body-1 font-weight-medium">
                    Select students to assign the test to
                </v-card-text>

                <v-skeleton-loader v-if="studentLoading" type="list-item-avatar@8"></v-skeleton-loader>
                <p class="mx-6" v-if="students.length == 0"> No students registered in that grade. </p>
                <div v-if="!studentLoading && students.length != 0" class="d-flex justify-end align-center">
                   <v-list-item class="px-5">
                        <v-list-item-content>
                            <v-list-item-title> Select all students </v-list-item-title>
                        </v-list-item-content>

                        <v-list-item-action>
                            <v-checkbox v-model="isAllSelected" @change="selectAllStudents()" ></v-checkbox>
                        </v-list-item-action>
                    </v-list-item>
                </div>
                <v-virtual-scroll v-if="!studentLoading" :items="students" :item-height="40" height="350">
                    <template v-slot:default="{ item }">
                        <v-list-item class="px-5">
                            <v-list-item-avatar>
                                <v-avatar color="primary" size="32" class="white--text">
                                {{ item.name[0] + item.surname[0] }}
                                </v-avatar>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title>{{ item.name + " " + item.surname }}</v-list-item-title>
                            </v-list-item-content>

                            <v-list-item-action>
                                <v-checkbox v-model="selectedStudents" :value="item.id"></v-checkbox>
                            </v-list-item-action>
                        </v-list-item>
                    </template>
                    </v-virtual-scroll>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text outlined :disabled="handoutLoading" class="no-uppercase" @click="handoutDialog = false">
                        Cancel
                    </v-btn>
                    <v-btn :loading="handoutLoading" class="no-uppercase" :disabled="!selectedStudents.length" color="primary" @click="handoutTest()">
                        Hand out
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import concreteTestDataService from '../../services/concreteTestDataService';
import generatorService from "../../services/generatorService";
import TestDataService from "../../services/testDataService";
import userDataService from '../../services/userDataService';

    export default {
        data() {
            return {
                selectedTestId: -1, // Which task was selected to modify or delete from the table

                deleteDialog: false, // Show 'Are you sure' dialog for deletion
                search: "",
                headers: [
                    {text: "Test name", value: "name", width: "25ch"},
                    {text: "Grade", value: "grade", width: "25ch"},
                    {text: "Last Modified", value: "last_mod", width: "45ch", },
                    {text: "Hand out", value: "delete", align: "center", sortable: false, width: "1ch"},
                    {text: "Results", value: "delete", align: "center", sortable: false, width: "1ch"},
                    {text: "Modify", value: "modify", align: "center", sortable: false, width: "1ch" },
                    {text: "Delete", value: "delete", align: "center", sortable: false, width: "1ch" },
                ],

                tests: [ ],

                handoutDialog: false,
                students: [],
                selectedStudents: [],

                loadStudents: false,
                selectAll: false,

                loading: false,
                handoutLoading: false,
                studentLoading: false,
            };
        },

        beforeRouteEnter(to, from, next) {
            next(() => {
                console.log(from);
            });
        },

        computed: { 
            /* isAllSelected() {
                return this.students.length == this.selectedStudents.length
            }, */

            isAllSelected: {
                get () {
                    return this.students.length == this.selectedStudents.length
                },
                set (value) {
                    this.selectAll = value;
                }
            }
        },

        created() { },

        // This function runs before the UI loads
        beforeMount() {
            // Load tasks from the database
            this.retrieveTests();
        },

        methods: { 

            showTestResults(test) {
                this.$router.push({name: "viewStudentResults", params: { id: test.id }});
            },

            wasHandedOut(test) {
                return test.created.length != 0;
            },

            selectAllStudents() {
                console.log(this.selectedStudents);

                if( this.selectAll ) {
                    this.students.forEach((student) => {
                        if(!this.selectedStudents.find((id) => id == student.id ) ) {
                            this.selectedStudents.push(student.id);
                        }
                    });
                } else {
                    this.students.forEach((student) => {
                        let index = this.selectedStudents.findIndex((id) => id == student.id )
                        if(index != -1) {
                            this.selectedStudents.splice(index, 1);
                        }
                    });
                }
                
            },

            ...mapActions({
                startTestModification: 'test/startTestModification'
            }),

            // Hand out test to students
            async handoutTest() {

                try {
                    this.handoutLoading = true;

                    // Get selected AbstractTest
                    let abstractTest = await TestDataService.get(this.selectedTestID);

                    // Extract abstractTasks
                    let abstractTasks = abstractTest.data.tasks.map((task) => {
                        return {
                            content: task.content,
                            renderOption: task.testTasks.renderOption
                        }
                    });

                    // For each selected student
                    
                    for(let student of this.selectedStudents) {

                        // Generate ConcreteTasks from AbstractTasks
                        let generated = await generatorService.generateMultiple({ abstractTasks });
                        console.log('HERE IS THE CONCRETE TASKS', generated.data.concreteTasks);

                        // Save expected answers
                        let expectedAnswers = [];
                        for(let concreteTask of generated.data.concreteTasks) {
                            console.log(concreteTask.content.expectedAnswers);
                            expectedAnswers = expectedAnswers.concat([...concreteTask.content.expectedAnswers]);
                            delete concreteTask.content.expectedAnswers
                        }
                        

                        // Create a new ConcreteTest
                        let concreteTest = await concreteTestDataService.create({
                            name: abstractTest.data.name,
                            timeLimit: abstractTest.data.timeLimit,
                            // tasks {content, renderOption}
                            content: generated.data.concreteTasks,
                            expectedAnswers: expectedAnswers,
                            createdFrom: this.selectedTestID,
                            assignedTo: student,
                            assignedBy: this.$store.state.app.userID
                        });
                    }

                    this.handoutLoading = false;
                    this.handoutDialog = false;
                    this.$store.dispatch("showMessage", { message: "Tests successfuly handed out!" });
                } catch(error) {
                    this.handoutLoading = false;
                    this.$store.dispatch("showMessage", { message: error.response.data.message, sucess: false });
                }
            },

            // Opens the dialog window to hand out tests to students
            async openHandOutDialog(test) {
                this.students = [];
                this.selectedStudents = [];

                // Show loading and open dialog
                this.studentLoading = true;
                this.handoutDialog = true;

                // Get all users and filter students
                userDataService.getStudentsByGrade({grade: test.grade}).then(({data}) => {

                    console.log(data);

                    this.students = data.filter(({type}) => type == "student").map((student) => {
                        return {
                            id: student.id,
                            name: student.name,
                            surname: student.surname,
                        }
                    });
                    this.studentLoading = false;
                }).catch((err) => {
                    this.$store.dispatch("showMessage", {message: "Sorry, an error occurred while loading students...", success: false});
                });

                // Save hand out testID
                this.selectedTestID = test.id;

                console.log(this.$store.state.app.userID);
                console.log(this.selectedTestID);
            },

            // Modify selected task in next window
            modifyTest(item) {
                // Pass id paramter to the router
                this.startTestModification({testId: item.id});
                this.$router.push({name: "createTest", params: {testId: item.id}});
            },
            
            // Show delete dialog
            showDeleteDialog(item) {
                this.selectedTestID = item.id;
                this.deleteDialog = true;
            },

            // Delete selected task
            deleteTest(id) {
                TestDataService.delete(id)
                .then((res) => {
                    this.retrieveTests();
                    this.$store.dispatch('showMessage', {message: res.data.message});
                    this.deleteDialog = false;
                })
                .catch((err) => {
                    this.retrieveTests();
                    this.$store.dispatch('showMessage', {message: err.response.data.message, success: false});
                    this.deleteDialog = false;
                })
            },

            // Setup mapping of tasks
            getDisplayTest(test) {
                return {
                    id: test.id,
                    name: test.name,
                    last_mod: test.updatedAt,
                    created: test.created,
                    grade: test.grade
                };
            },

            // Get tasks from database
            retrieveTests() {
              this.loading = true;
              TestDataService.getAll()
                .then((response) => {
                  this.tests = response.data.map(this.getDisplayTest);
                  //console.log(response.data);
                  this.loading = false;
                })
                .catch((e) => {
                  console.log(e);
                  this.loading = false;
                  this.$store.dispatch('showMessage', { message: e.message });
                });
            },
        },
    }
</script>

<style>
    .b-g {
        background-color: var(--green-background-color);
        height: 90%;
    }
    .r-g {
        height: 90%;
    }
    .h-g {
        border: solid 2px hotpink;
    }

    [text-narrow] {
        line-height: 1.1 !important;
        font-size: 1rem;
    }

    .pointer {
        cursor: pointer !important;
    }
</style>