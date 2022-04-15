<template>
    <v-container class="d-flex flex-column">
        <p class="text-h4 align-self-center"> {{ testName }} </p>

        <!-- Time for task -->
        <v-card outlined class="mx-6 my-2 px-6 py-3">
        <p class="ma-0 py-2 text-body-1"> 
            Time remaining: <span class="font-weight-medium text-subtitle-1">{{ timer }}</span>
        </p>
        </v-card>

        <!-- Cards with task details, render options preview -->
        <v-card v-for="(task, tIndex) in test.content"
            :key="tIndex" hover outlined class="my-2 mx-6 px-3">
            <!-- Task name -->
            <v-card-title class="d-flex justify-space-between text-h5 font-weight-medium">
              Task #{{ tIndex + 1 }}
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
                      <v-select 
                        dense :items="answer.options" 
                        :value="test.content[tIndex].content.questions[i].answers[optIndex].selected" :label="Answer" outlined>
                      </v-select>
                  </div>
                </div>

                <!-- type == 'radio' -->
                <div class="d-flex flex-row justify-space-between mb-1" v-if="task.renderOption == 'radio'">  
                  <div class="d-flex flex-column py-1 px-2" v-for="(answer, optIndex) in question.answers" :key="optIndex">
                    <v-radio-group v-model="test.content[tIndex].content.questions[i].answers[optIndex].selected">
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
                      <v-checkbox dense class="pa-0 ma-0" v-for="(value) in answer.options"
                        :key="value" :label="value.toString()" v-model="test.content[tIndex].content.questions[i].answers[optIndex].selected">
                      </v-checkbox>
                  </div>
                </div>

                <!-- type == 'text' -->
                <div class="d-flex flex-row justify-space-between mb-1" v-if="task.renderOption == 'text'"> 
                  <div class="dflex flex-column py-1 mr-4" v-for="(answer, optIndex) in question.answers" :key="optIndex">
                      <v-text-field dense
                        :label="Asnwer"
                        v-model="test.content[tIndex].content.questions[i].answers[optIndex].selected"
                        outlined
                      ></v-text-field>
                  </div>
                </div>

              </div>
            </v-card-text>
          </v-card>

          <!-- Action buttons -->
          <v-row class="d-flex justify-end align-center pa-2 px-6 mt-2">
            <v-btn outlined class="my-2 mb-4 mx-2 align-self-end" text @click="$router.push({name: 'yourAssignments'})"> Back </v-btn>
            <v-btn outlined color="primary" class="my-2 mb-4 mx-2 align-self-end" @click="saveAnswers()"> Save answers </v-btn>
            <v-btn class="my-2 mb-4 mx-2 align-self-end" color="primary" @click="finishTest()"> Finish test </v-btn>
          </v-row>
        </v-container>
</template>

<script>
  import concreteTestDataService from "../services/concreteTestDataService";

  export default {
      data() {
          return {
              testName: 'New Test Name',

              // tasks
              test: {},
              timer: "",

              // remove task dialog
              exitDialog: false,

              placeholderModel: {}
          }
      },
      methods: {
          // Save selected or typed answers to test
          saveAnswers() {
            concreteTestDataService.update(this.$route.params.id, {
              content: this.test.content
            }).then(({data}) => {
              console.log(data);
              this.$store.dispatch('showMessage', {message: "Answers saved!"});
            }).catch((err) => {
              console.log(err);
              this.$store.dispatch('showMessage', {message: "Error occured while saving answers...", success: false});
            })
          },

          // Save answers and set test as finished
          async finishTest() {
            concreteTestDataService.update(this.$route.params.id, {
              content: this.test.content,
              status: "Finished", 
              finishedAt: new Date()
            }).then(async ({data}) => {
              // Test completed
              console.log(data);

              this.$router.push({name: 'yourAssignments'});
              this.$store.dispatch('showMessage', {message: "Test completed!"});
            }).catch((err) => {
              // error
              console.log(err);
              
              this.$store.dispatch('showMessage', {message: "Error occured while saving answers...", success: false});
              this.$router.push({name: 'yourAssignments'});
            })
          },

          async syncTime() {

              console.log(this.test.content);

              // If the timestamps are out of line, test is over
              let concreteTest = await concreteTestDataService.get(this.$route.params.id);

              // Save timestamps 
              let shouldFinishBefore = new Date(concreteTest.data.shouldFinishBefore);
              let now = new Date();

              // Check if timer should ran out
              if( now >= shouldFinishBefore ) {
                  // Update test status to finished and ending timestamp
                  let response = await concreteTestDataService.update(this.$route.params.id, { 
                    status: "Finished", 
                    finishedAt: now
                  });

                  // Return back to yourAssignments page and show snackbar message
                  if( response ) {
                    this.$router.push({name: "yourAssignments"});
                    this.$store.dispatch('showMessage', {message: "Time limit reached!", success: false});
                  }
              } else {
                  // Get minutes and seconds remaining
                  let minutes = Math.trunc( ((shouldFinishBefore - now) / (1000 * 60)) );
                  let seconds = Math.trunc( ((shouldFinishBefore - now) / (1000)) % 60 );

                  // Add 0 before
                  minutes = minutes.toString().length == 1 ? `0${minutes}` : `${minutes}`;
                  seconds = seconds.toString().length == 1 ? `0${seconds}` : `${seconds}`;

                  // Save value
                  this.timer =  `${minutes}m : ${seconds}s`;
                  setTimeout(this.syncTime, 1000);
              }
          },

          // Get selected test for starting
          async retrieveTest() {
              // Get ConcreteTest by ID from URL
              let response = await concreteTestDataService.get(this.$route.params.id); 
              
              // Save test locally
              this.test = response.data;
              console.log("TEST", this.test);

              // Check if the student started working on the test or reloaded the window/browser
              if( this.test.status == 'Handed Out' ) {
                  concreteTestDataService.update(
                      this.$route.params.id, { 
                          status: "In Progress", 
                          shouldFinishBefore: new Date( (new Date()).getTime() + this.test.timeLimit * 60000)
                      }
                  // Wait until the shouldFinishBefore value updates in the DB
                  ).then((response) => {
                      // Each subsequent second, sync remaining time to shouldFinishBefore in DB
                      this.syncTime();
                  })
              } else {
                // Start remaining time counter
                this.syncTime();
              }
          },
      },

      mounted() {
          // Load test from the database
          this.retrieveTest();
      },

      computed: { }
  }
</script>

<style></style>