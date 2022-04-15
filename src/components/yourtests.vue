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
                :headers="headers" :items="tests" :items-per-page="7" :search="search" width="80%">
                <template v-slot:item="row">
                    <tr>
                        <td>{{ row.item.name }}</td>
                        <td>{{ getHumanReadableTimestamp(row.item.last_mod) }}</td>

                        <td class="px-12">
                        <v-btn plain class="pa-0" :ripple="false" @click.stop="openHandOutDialog(row.item)">
                            <v-icon class="pa-0 ma-0" color="primary">
                                mdi-clipboard-arrow-up-outline
                            </v-icon>
                        </v-btn>
                        </td>
                        <td class="px-0">
                        <v-btn plain class="pa-1" :ripple="false" @click="modifyTest(row.item)">
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

                <v-virtual-scroll :items="students" :item-height="40" height="350">
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
                    <v-btn text outlined @click="handoutDialog = false">
                        Cancel
                    </v-btn>
                    <v-btn :disabled="!selectedStudents.length" color="primary" @click="handoutTest()">
                        Hand out
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import concreteTestDataService from '../services/concreteTestDataService';
import generatorService from "../services/generatorService";
import TestDataService from "../services/testDataService";
import userDataService from '../services/userDataService';

    export default {
        data() {
            return {
                selectedTestId: -1, // Which task was selected to modify or delete from the table

                deleteDialog: false, // Show 'Are you sure' dialog for deletion
                search: "",
                headers: [
                    {text: "Test name", value: "name", width: "50ch"},
                    {text: "Last Modified", value: "last_mod", width: "45ch"},
                    {text: "Hand out", value: "delete", align: "center", sortable: false, width: "5ch"},
                    {text: "Modify", value: "modify", align: "center", sortable: false, width: "1ch" },
                    {text: "Delete", value: "delete", align: "center", sortable: false, width: "1ch" },
                ],

                tests: [ ],

                handoutDialog: false,
                students: [],
                selectedStudents: [],

                loadStudents: false
            };
        },

        beforeRouteEnter(to, from, next) {
            next(() => {
                console.log(from);
            });
        },

        computed: { },

        created() { },

        // This function runs before the UI loads
        beforeMount() {
            // Load tasks from the database
            this.retrieveTests();
        },

        methods: { 

            ...mapActions({
                startTestModification: 'test/startTestModification'
            }),

            // Hand out test to students
            async handoutTest() {

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
                this.selectedStudents.forEach(async (student) => {

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
                    concreteTestDataService.create({
                        name: abstractTest.data.name,
                        timeLimit: abstractTest.data.timeLimit,
                        // tasks {content, renderOption}
                        content: generated.data.concreteTasks,
                        expectedAnswers: expectedAnswers,
                        createdFrom: this.selectedTestID,
                        assignedTo: student,
                        assignedBy: this.$store.state.app.userID 
                    }).then(({data}) => {
                        console.log(data);
                        this.handoutDialog = false;
                    }).catch((err) => {
                        console.log(err.data.message);
                    });

                });
            },

            async openHandOutDialog(test) {
                this.students = [];
                this.selectedStudents = [];

                // Get all users and filter students
                userDataService.getAll().then(({data}) => {
                    this.students = data.filter(({type}) => type == "student").map((student) => {
                        return {
                            id: student.id,
                            name: student.name,
                            surname: student.surname,
                        }
                    });
                    this.handoutDialog = true;
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
                    last_mod: test.updatedAt
                };
            },
            // Get tasks from database
            retrieveTests() {
              TestDataService.getAll()
                .then((response) => {
                  this.tests = response.data.map(this.getDisplayTest);
                  console.log(response.data);
                })
                .catch((e) => {
                  console.log(e);
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