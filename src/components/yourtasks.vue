<template>
    <v-container 
        class="d-flex flex-column justify-start align-center mt-5 rounded-lg">

        <v-card elevation="0" class="ml-0">
            <v-card-title class="d-flex flex-row justify-space-between align-center">
            <h3 class="t-t-color text-h5 pt-3 font-weight-medium"> All your tasks </h3>
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
            :loading="loading"
            loading-text="Loading tasks... Please wait"
            :headers="headers"
            :items="tasks"
            :items-per-page="7"
            :search="search"
            width="80%"
        >
             <template v-slot:item="row">
                <tr>
                    <td>{{ row.item.name }}</td>
                    <td>{{ getHumanReadableTimestamp(row.item.last_mod) }}</td>

                    <td>
                    <v-btn plain class="pa-1" :ripple="false" @click="modifyTask(row.item.id)">
                        <v-icon color="var(--main-text-color)">
                            mdi-pencil-outline
                        </v-icon>
                    </v-btn>
                    </td>
                    <td>
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

        <!-- Display quick message for the user -->
            <v-snackbar v-model="infoMessage" :timeout="2500" outlined :color="this.success ? 'green' : 'red'" top>
                <!-- text message -->
                {{ message }}
                <!-- close icon -->
                <template v-slot:action="{ attrs }">
                    <v-btn plain v-bind="attrs" @click="infoMessage = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </template>
            </v-snackbar>
        <!-- Display quick message for the user -->

        <v-dialog v-model="deleteDialog" width="325">
            <v-card>
                <v-card-title class="text-h5 lighten-2"> Delete task? </v-card-title>

                <v-card-text> Are you sure you want to delete this task? </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="black" text @click="deleteDialog = false"> Cancel </v-btn>
                    <v-btn color="red" text @click="deleteTask(currentId)"> Delete </v-btn>
                </v-card-actions>
                
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
    import TaskDataService from "../services/taskDataService";

    export default {
        data() {
            return { 
                message: "",
                success: false,
                infoMessage: false,

                currentId: -1, // which task was selected to modify or delete from the table

                deleteDialog: false, // show 'Are you sure' dialog for deletion
                search: "",
                headers: [
                    {text: "Task name", value: "name", width: "60ch"},
                    {text: "Last Modified", value: "last_mod", width: "50ch"},
                    {text: "Modify", value: "modify", align: "center", sortable: false, width: "10ch"},
                    {text: "Delete", value: "delete", align: "center", sortable: false, width: "10ch"},
                ],
                tasks: [ ]
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
            // delete selected task
            showDeleteDialog(item) {
                this.currentId = item.id;
                this.deleteDialog = true;
            },
            deleteTask(id) {
                TaskDataService.delete(id)
                .then((res) => {
                    this.$store.dispatch('showMessage', {message: res.data.message });
                    this.retrieveTasks();
                    this.deleteDialog = false;
                })
                .catch((err) => {
                    this.$store.dispatch('showMessage', {message: err.resposne.data.message });
                    this.retrieveTasks();
                    this.deleteDialog = false;
                })
            },

            // setup mapping of tasks
            getDisplayTask(task) {
                return {
                    id: task.id,
                    name: task.name,
                    last_mod: task.updatedAt
                };
            },
            // get tasks from database
            retrieveTasks() {
              this.loading = true;
              TaskDataService.getAll()
                .then((response) => {
                  this.tasks = response.data.map(this.getDisplayTask);
                  this.loading = false;
                  //console.log(response.data);
                })
                .catch((e) => {
                    this.loading = false;
                    this.$store.dispatch("showMessage", { message: e.reponse.data.message });
                    //console.log(e);
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