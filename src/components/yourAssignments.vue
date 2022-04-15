<template>
    <v-container 
        class="d-flex flex-column justify-start align-center mt-5 rounded-lg">

        <v-card elevation="0" class="ml-0">
            <v-card-title class="d-flex flex-row justify-space-between align-center">
            <h3 class="t-t-color text-h5 pt-3 font-weight-medium"> Your assignments </h3>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
            ></v-text-field>
            </v-card-title>
            
            <v-data-table
            :headers="headers"
            :items="assignments"
            :items-per-page="7"
            :search="search"
            width="80%"
        >
             <template v-slot:item="row">
                <tr>
                    <td>{{ row.item.name }}</td>
                    <td>{{ row.item.assignedBy }}</td>
                    <td>{{ row.item.timeLimit }} minutes </td>

                    <td>
                      <v-tooltip v-if="row.item.status == 'Handed Out'" right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn v-bind="attrs" v-on="on" plain class="pa-1" 
                          icon :ripple="false" @click="startDialog = true; selectedTest = row.item">
                              <v-icon color="text">
                                  mdi-draw
                              </v-icon>
                          </v-btn>
                        </template>
                        <span> Start Test </span>
                      </v-tooltip>
                      <v-tooltip v-if="row.item.status == 'In Progress'" right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn v-bind="attrs" v-on="on" plain class="pa-1" 
                          icon :ripple="false" @click="selectedTest = row.item; startTest(selectedTest.id)">
                              <v-icon color="primary">
                                  mdi-draw
                              </v-icon>
                          </v-btn>
                        </template>
                        <span> Continue Test </span>
                      </v-tooltip>
                      <v-tooltip v-if="row.item.status == 'Finished'" right>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn v-bind="attrs" v-on="on" plain class="pa-1" 
                          icon :ripple="false" @click="viewResults(row.item)">
                              <v-icon color="text">
                                  mdi-file-eye-outline
                              </v-icon>
                          </v-btn>
                        </template>
                        <span> View Result </span>
                      </v-tooltip>
                    </td>
                </tr>
            </template>

        </v-data-table>

        </v-card>

        <v-dialog v-model="startDialog" width="325">
            <v-card>
                <v-card-title class="text-h5 lighten-2"> Start task </v-card-title>

                <v-card-text> You will have exactly 
                    <span class="font-weight-medium text-body-1">
                        {{ selectedTest.timeLimit }} minutes
                    </span> 
                    to complete this test. Do not close the browser window during 
                    the test or you will lose your data and will need to start over. 
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="black" outlined text @click="startDialog = false"> Cancel </v-btn>
                    <v-btn color="primary" @click="startTest(selectedTest.id)"> Start </v-btn>
                </v-card-actions>
                
            </v-card>
        </v-dialog>

        <v-dialog v-model="resultsDialog" width="450">
            <v-card>
                <v-card-title class="text-h5 lighten-2"> Test results </v-card-title>

                <v-card-text class="text-body-1"> 
                    You overall score: {{ calculatedPercentage }} <br>
                    Correct answers: {{ calculatedFraction }}
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" outlined text @click="resultsDialog = false"> Close </v-btn>
                </v-card-actions>
                
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
import concreteTestDataService from '../services/concreteTestDataService';
    import TaskDataService from "../services/taskDataService";
import userDataService from '../services/userDataService';

    export default {
        data() {
            return { 
                selectedTest: {}, // Which test was selected to begin or view result of
                startDialog: false, // Show 'Are you sure' dialog before starting test
                resultsDialog: false,
                calculatedFraction: '',
                calculatedPercentage: '',
                
                search: "",
                headers: [
                    {text: "Test name", value: "test_name", width: "45ch"},
                    {text: "Assigned by", value: "assignedBy", width: "50ch"},
                    {text: "Time limit", value: "time_limit", width: "25ch"},
                    {text: "Action", value: "action", align: "center", sortable: false, width: "10ch"},
                ],
                assignments: [ ]
            };
        },

        computed: { },

        created() { },

        // This function runs before the UI loads
        beforeMount() {
            // Load tasks from the database
            this.retrieveTasks();
        },

        methods: { 
            testResult() {
                // If a test is selected
                if( this.selectedTest ) {
                    let answersTotal = 0;
                    let correctAnswers = 0;
                    for(let task of this.selectedTest.content) {
                        for(let question of task.content.questions) {
                            for(let answer of question.answers) {
                                // Increment total answer count
                                answersTotal = answersTotal + 1;

                                // Check if answer is correct
                                if(answer.correct[0] == answer.selected)
                                    correctAnswers = correctAnswers + 1;
                            }
                        }
                    }

                    this.calculatedPercentage = (correctAnswers/answersTotal) * 100;
                    this.calculatedFraction = `${correctAnswers}/${answersTotal}`;
                }
            },

            startTest(id) {
                this.$router.push({name: "takeTest", params: {id: id}})
            },

            async viewResults(test) {
                this.selectedTest = test;
                await this.getResults(test.id);
                this.resultsDialog = true;
            },

            // delete selected task
            showDeleteDialog(item) {
                this.currentId = item.id;
                this.deleteDialog = true;
            },
            deleteTask(id) {
                TaskDataService.delete(id)
                .then((res) => {
                    this.message = res.data.message;
                    this.success = true;
                    this.infoMessage = true;
                    this.retrieveTasks();
                    this.deleteDialog = false;
                })
                .catch((err) => {
                    this.message = err.response.data.message;
                    this.success = false;
                    this.infoMessage = true;
                    this.retrieveTasks();
                    this.deleteDialog = false;
                })
            },

            // Setup mapping of tasks
            getDisplayTask(task) {
                return {
                    id: task.id,
                    name: task.name,
                    last_mod: task.updatedAt
                };
            },
            // Get tasks from database
            retrieveTasks() {
                userDataService.getStudentAssignments(this.$store.state.app.userID).then(({data}) => {    

                    console.log("CONTENT: ", data);

                    this.assignments = data.assignments.map((test) => {
                        return {
                            id: test.id,
                            name: test.name,
                            assignedBy: `${test.assignedBy.name}  ${test.assignedBy.surname}`,
                            timeLimit: test.timeLimit,
                            status: test.status,
                            content: test.content
                        }
                    });
                });
            },

            // Get results
            async getResults(id) {
                let results = await concreteTestDataService.getResults(id);
                this.calculatedPercentage = results.data.percentage;
                this.calculatedFraction = `${results.data.correct}/${results.data.total}`;
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