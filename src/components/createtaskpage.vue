<template>
    <v-container id="task" class="d-flex flex-column justify-start align-center mt-2 pb-0 b-g rounded-lg">

        <!-- Task name -->        
        <h4 class="text-h5 custom-font my-4 font-weight-medium"> {{ this.name }} </h4>

        <v-container fluid rounded label="Task" class="d-flex flex-row" style="height: 100%;">

            <!-- Left side -->
            <v-col cols="16" class="mx-2 py-0 px-2 ma-0 d-flex flex-column justify-start">

            <!-- Task text text-field -->
            <div class="d-flex flex-column justify-start flex-grow-0">
                <h3 class="ml-2 mb-1"> Task text </h3>
                <v-textarea text-narrow spellcheck="false" background-color="white" color="black"
                    id="task-text" class="text-h3 pb-2" v-model="text" solo no-resize hide-details rows="5">
                </v-textarea>
            </div>

            <!-- Variables chips section -->
            <h3 class="ml-2 mb-1"> Variables </h3>          
                <div class="d-flex flex-row flex-wrap align-center ma-0 pa-0 minus">
                    <div v-for="(variable, ind) in ext_text.task.variables" :key="ind + 'v'" class="ma-0 pa-0">
                        <v-chip v-if="variable.visible" @click="variableInfo(ind)"
                            color="primary" label class="mx-2 my-1 px-6 py-4 pointer elevation-1">
                            {{ variable.name.substr(1) }}
                        </v-chip>
                    </div>                    
                    
                    <!-- Add variable icon -->
                    <div>
                        <v-btn @click="addVariable()" depressed class="no-uppercase">
                            <v-icon>mdi-plus</v-icon>
                            Add Variable
                        </v-btn>
                    </div>
                </div>

                <!-- Answers chips section -->
                <h3 class="ml-2">Answers</h3>
                    <div class="d-flex flex-row flex-wrap align-center ma-0 pa-0 minus">
                        <div v-for="(answer, i) in ext_text.task.answers" :key="i + 'a'" class="ma-0 pa-0">
                            <v-chip v-if="answer.visible" @click="answerInfo(i)"
                                color="primary" label class="mx-2 my-1 px-6 py-4 pointer">
                                {{ answer.name.substr(1) }}
                            </v-chip>
                        </div>
                    </div>

            <!-- PREVIEW -->
            <v-overlay id="latexMath" :value="taskOverlay" :light="true" :dark="false">
                <v-sheet 
                    elevation="4" width="650"
                    style="height: 600px; overflow-y: auto"
                    class="pa-4 ma-2 d-flex flex-column justify-flex-start align-flex-start rounded-lg">
                    
                    <v-btn plain icon @click="taskOverlay = false" class="close-button mt-4 mr-6 pa-0 shrink">
                        <v-icon color="danger">mdi-close</v-icon>
                    </v-btn>

                    <h3 class="ma-2 pa-1"> {{ preview.text.trim() }} </h3>
                    <div class="d-flex flex-column ma-2 pa-1" v-for="(q, i) in preview.questions" :key="'q' + i">
                        
                        <h4 id="qLatex" class="ma-1"> {{ replaceAnswers(q.text.trim()) }} </h4>
                        <math-jax :latex="replaceAnswers(q.text.trim())"></math-jax>

                        <div class="ma-1 pa-1" v-for="(a, i) in q.answers" :key="'a' + i">
                            <p v-for="(item, index) in a.correct" :key="index"> a) {{item}} </p>
                            <p v-for="(item, index) in a.incorrect" :key="'ia' + index"> 
                                {{ String.fromCharCode(98 + index) + ')'}} {{item}} 
                            </p>
                        </div>
                    </div>
                </v-sheet>
            </v-overlay>

            </v-col>
            
            <!-- Right side -->
            <v-col cols="16" class="mx-2 pa-0 d-flex flex-column justify-space-between">

            <!-- Questions section -->
            <div class="d-flex flex-column justify-start flex-grow-0">
                <h3 class="ml-2 mb-0"> Questions </h3>
                <div class="d-flex flex-column justify-start" style="height: 220px; overflow-y: auto">
                    <div
                        class="d-flex flex-row align-center" 
                        v-for="(question, i) in ext_text.task.questions" :key="i">
                        <v-text-field
                            :label="'Task question #' + i"
                            placeholder="eq.: What is the result? @res"
                            solo hide-details color="error"
                            class="my-1 d-flex flex-grow-1"
                            v-model="ext_text.task.questions[i].text">
                            <template v-slot:append>
                                <v-icon color="error" @click="removeQuestion(i)">mdi-delete-empty</v-icon>
                            </template>
                        
                        </v-text-field>
                    </div>
                    <!-- Add question button -->
                    <v-btn @click="addQuestion" depressed class="my-1 no-uppercase align-self-start">
                        <v-icon>mdi-plus</v-icon>  
                        Add Question 
                    </v-btn>
                </div>
            </div>
            <div class="d-flex flex-row mt-2 mb-1 justify-self-end">
                <v-btn class="mx-1" @click="parseText">Parse</v-btn>
                <v-btn class="mx-1" @click="previewTask">Preview</v-btn>
                <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn v-bind="attrs" v-on="on" large icon
                            @click="previewTask"
                            class="mx-2 my-1 px-2 py-2 pointer elevation-2">
                            <v-icon small> mdi-plus </v-icon>
                            </v-btn>
                        </template>
                        <span> Preview task </span>
                    </v-tooltip>
                <v-btn elevation="2" large color="white"
                class="px-6 py-2 mx-2 no-uppercase" @click="getCategories(); overlaySave = true"> Save
                </v-btn>
                <!-- <v-btn class="mx-1" @click="restoreText">Restore</v-btn> -->
            </div>

            </v-col>
        </v-container>

        <!-- Make this a dialog...variale dialog -->
        <v-overlay tabindex="0" @keydown.esc="overlayV = false"
            :value="overlayV" :light="true" :dark="false" v-if="ext_text.task.variables.length != 0">
            <v-sheet 
                elevation="4" width="500" 
                class="pa-4 ma-2 mt-0 pt-2 d-flex flex-column justify-flex-start align-flex-start rounded-lg">
                <!-- Close icon -->
                <v-btn plain icon @click="overlayV = false" class="close-button mt-4 mr-6 pa-0 shrink">
                    <v-icon color="danger">mdi-close</v-icon>
                </v-btn>
                <!-- Delete variable -->
                <v-btn 
                    v-if="ext_text.task.variables[indexV].added"
                    icon @click="overlayV = false; removeVariable(indexV)"
                    class="close-button mt-4 mr-14 pa-0 shrink">
                    <v-icon color="red">mdi-delete</v-icon>
                </v-btn>

                <h2 class="ma-2 mt-3" :contenteditable="ext_text.task.variables[indexV].added"> 
                    {{ ext_text.task.variables[indexV].name }} 
                </h2>
                
                <p class="ma-2"> Definition </p>
                <v-text-field 
                    label="" placeholder="e.g.: ( $a * 2 ) + 1" 
                    v-model="ext_text.task.variables[indexV].definition" 
                    outlined dense class="shrink mx-2"> 
                    {{ ext_text.task.variables[indexV].definition }} 
                </v-text-field>
                
                <p class="ma-2 mt-0"> Range {{ ext_text.task.variables[indexV].range.fullRange() }} </p>
                <v-row class="d-flex flex-row flex-nowrap px-3">
                    <v-text-field 
                        label="Start" v-model="ext_text.task.variables[indexV].range.start" 
                        outlined dense class="shrink mx-2 mt-3">
                    </v-text-field>
                    <v-text-field 
                        label="End" v-model="ext_text.task.variables[indexV].range.end" 
                        outlined dense class="shrink mx-2 mt-3">
                    </v-text-field>
                    <v-text-field 
                        label="Step" v-model="ext_text.task.variables[indexV].range.step"
                        outlined dense class="shrink mx-2 mt-3">
                    </v-text-field>
                </v-row>
            </v-sheet>
        </v-overlay>

        <!-- Answer overlay -->
        <v-overlay
            :light="true" :dark="false"
            :value="overlayA" v-if="ext_text.task.answers.length != 0">
            <v-sheet 
            elevation="4" width="500" 
            height="500px"
            class="pa-4 ma-2 mt-0 pt-2 d-flex flex-column justify-flex-start align-flex-start rounded-lg overflow-y-auto">
            <!-- Close icon -->
            <v-btn plain icon @click="overlayA = false" class="close-button mt-4 mr-6 pa-0 shrink">
                <v-icon color="danger">mdi-close</v-icon>
            </v-btn>
            <h2 class="ma-2 mt-3"> 
                {{ ext_text.task.answers[indexA].name }}
            </h2>

            <p class="ma-2 mt-0"> Range {{ ext_text.task.answers[indexA].range.fullRange() }} </p>
            <v-row class="d-flex flex-row flex-nowrap px-3 shrink">
                <v-text-field 
                    label="Start" v-model="ext_text.task.answers[indexA].range.start" 
                    outlined dense class="shrink mx-2 mt-3">
                </v-text-field>
                <v-text-field 
                    label="End" v-model="ext_text.task.answers[indexA].range.end" 
                    outlined dense class="shrink mx-2 mt-3">
                </v-text-field>
            </v-row>

            <p class="ma-2 mt-0">Correct</p>
            <div 
                class="d-flex flex-row" 
                v-for="(el, i) in ext_text.task.answers[indexA].correct" :key="'el_c' + i">
                <v-text-field 
                    label="" 
                    placeholder="e.g.: ( $a * 2 ) + 1" 
                    v-model="ext_text.task.answers[indexA].correct[i]" 
                    outlined dense class="mx-2 my-0"> 
                    {{ el }}
                </v-text-field>
                <v-btn
                    @click="removeCorrect(i)" 
                    icon plain color="red" class="mx-2">
                    <v-icon>mdi-delete-empty</v-icon>
                </v-btn>
            </div>
            <v-btn depressed class="mx-2" @click="addCorrect">
                <v-icon>mdi-plus</v-icon>
                Add correct answer
            </v-btn>

            
            <p class="ma-2">Incorrect</p>
            <div 
                class="d-flex flex-row" 
                v-for="(el, i) in ext_text.task.answers[indexA].incorrect" :key="'el_ic' + i">
                <v-text-field 
                    label="" 
                    placeholder="e.g.: ( $a * 2 ) + 1" 
                    v-model="ext_text.task.answers[indexA].incorrect[i]" 
                    outlined dense class="mx-2 my-0"> 
                    {{ ext_text.task.answers[indexA].incorrect }}
                </v-text-field>
                <v-btn 
                    @click="removeIncorrect(i)"
                    icon plain color="red" class="mx-2">
                    <v-icon>mdi-delete-empty</v-icon>
                </v-btn>
            </div>
            <v-btn depressed class="mx-2" @click="addIncorrect">
                <v-icon>mdi-plus</v-icon>
                Add incorrect answer
            </v-btn>
            
            </v-sheet>
        </v-overlay>

        <!-- Answer type options dialog -->
        <v-dialog v-model="overlaySave" width="450" :retain-focus="false">
            <v-card class="d-flex flex-column rounded-lg pt-2">
                <p class="pb-4 my-2 font-weight-medium text-h5 align-self-center"> Task details</p>

                <!-- Set task name -->
                <v-text-field 
                    class="px-4" v-model="taskName" outlined label="Task name" placeholder="Enter task name">
                </v-text-field>

                <!-- Select grade -->
                <v-select 
                    class="px-4" :items="$store.state.test.grades" v-model="taskGrade" outlined label="Grade">
                </v-select>

                <!-- Set categories to task -->
                <v-combobox class="px-4" label="Categories" v-model="selectedTaskCategories" 
                    :items="taskCategories" multiple chips outlined>
                    <template v-slot:selection="data">
                        <v-chip color="primary" class="pa-2" v-bind="data.attrs">
                        {{ data.item }}
                        </v-chip>
                    </template>
                </v-combobox>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="black" outlined text @click="overlaySave= false"> Cancel </v-btn>
                    <v-btn dark color="primary" @click="saveText(); overlaySave = false"> Save </v-btn>
                </v-card-actions>
                
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
    import { tokenize, Token } from "../myfiles/tokenizer.js"
    import { parseMathLang, Question, ConcreteTask, Variable } from "../myfiles/taskHandler"
    import { Extractor } from "../myfiles/extractorModule";

    import TaskDataService from "../services/taskDataService";
    import GeneratorService from "../services/generatorService";
    import CategoryDataService from "../services/categoryDataService.js";

    import * as math from 'mathjs';
import testDataService from '../services/testDataService.js';

    export default {
        data() {   
            return {
                taskCategories: [],
                selectedTaskCategories: [],
                
                name: "New Task",
                taskName: "",
                taskGrade: null,
                text: "",
                task_text: "",

                formula: '$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$',

                ext_text: new Extractor(),
                preview: new ConcreteTask(),
                
                variables: [],
                questions: [],
                answers: [],

                overlayV: false,
                overlayA: false,
                overlayAddV: false,
                overlaySave: false,
                taskOverlay: false,
                indexV: 0,
                indexAV: 0,
                indexA: 0,
            };
        },
        computed: {
            getText() { return this.text; }
        },

        // Load task depending on navigation origin
        beforeMount() {
            console.log("taskId from route params", localStorage.getItem('taskId'))

            // Modify was selected from task history
            if( this.$route.params.taskId ) 
            {
                // Save id to localStorage, so we can reload page without lossing the id
                localStorage.setItem('taskId', this.$route.params.taskId)
            }

            // Id was saved from route params or if the page was reloaded
            if ( localStorage.getItem('taskId') )
            {
                // Load the task content from the database
                TaskDataService.get(localStorage.getItem('taskId'))
                    .then((res) => {
                        console.log(res);

                        try {
                            this.name = res.data.name;
                            this.taskName = res.data.name;
                            this.taskGrade = res.data.grade;
                            this.ext_text.task = parseMathLang(res.data.content);
                            res.data.categories.forEach(({name}) => {
                                this.selectedTaskCategories.push(name);
                            });

                            console.log('RECIEVED: ', res.data);
                            this.$store.dispatch('showMessage', { message: "Parsing successful!" });

                        } catch (error) {
                            this.$store.dispatch('showMessage', { message: error.message, success: false });
                        }
                        // this.ext_text.task = parseMathLang(res.data.content);

                        this.text = this.ext_text.task.text.trim();
                    })
                    .catch((error) => { 
                        this.errorHandler(error); 
                    });
            }

            // Get categories
            CategoryDataService.getAll().then(({data}) => {
                this.taskCategories = data.map(({name}) => name);
            })
        },

        mounted() { },

        created() { },

        methods: {

            getCategories() {
                CategoryDataService.getAll().then(({data}) => {
                    this.taskCategories = data.map(({name}) => name);
                });
            },

            replaceAnswers(_qText) {

                try {
                    let cleanText = _qText.replaceAll(Token.types.gAnswer, "").replaceAll("=", "").trim();
                    return math.parse(cleanText).toTex();
                } catch(error) {
                    return _qText;
                }
            },

            testext() {
                // Test extraction
                this.ext_text.extractVariable(tokenize(this.text));
            },

            async createNewTask() 
            {
                // Prepare data for sending
                var data = { name: this.taskName, grade: this.taskGrade, content: this.ext_text.generateText() };

                // Create new entry in database
                if ( localStorage.getItem('taskId') == null) {
                    
                    try{
                        let newTask = await TaskDataService.create(data);

                        localStorage.setItem('taskId', newTask.data.id);

                        console.log(this.selectedTaskCategories);

                        for(let selectedCategory of this.selectedTaskCategories) {
                            let category = await CategoryDataService.find({name: selectedCategory});

                            // check
                        }

                        this.$store.dispatch('showMessage', { message: "Task saved successfuly" });
                    } catch(error) {
                        // log
                        this.$store.dispatch('showMessage', { message: error.response.data.message, success: false });
                    }
                    }

                // Update existing entry
                else {    

                    let taskId = localStorage.getItem('taskId');
                    let task = await TaskDataService.get(taskId);

                    try{
                        // Delete each category on the task
                        for(let category of task.data.categories) {
                            TaskDataService.removeCategory({ taskId: taskId, categoryId: category.id });
                        }
                    } catch(error) {
                        //
                        console.log("Error while deleting categories from task");
                    }

                    // Add each selectedCategory to task
                    for(let selectedCategory of this.selectedTaskCategories) {

                        try {
                            // Find category id in DB
                            let category = await CategoryDataService.find({name: selectedCategory}); 
                            
                            // Add category to task
                            await TaskDataService.addCategory(
                                { taskId: taskId, categoryId: category.data.id }
                            )
                        } catch(error) {

                            // Create category
                            let category = await CategoryDataService.create({name: selectedCategory});
                            
                            // Add category to task
                            await TaskDataService.addCategory(
                                { taskId: taskId, categoryId: category.data.id }
                            )

                            console.log("Added");
                        }
                    }


                    TaskDataService.update( localStorage.getItem('taskId'), data ) 
                        .then((res) => {
                            console.log(res);
                            this.$router.push({name: "yourTasks"});
                            this.$store.dispatch('showMessage', { message: res.data.message });
                        })
                        .catch((err) => {
                            this.$store.dispatch('showMessage', { message: err.response.data.message, success: false });
                        })
                }
            },

            variableInfo : function(i) {
                this.indexV = i
                this.overlayV = true
            },
            addedVariableInfo: function(i) {
                this.indexAV = i
                this.overlayAddV = true;
            },
            answerInfo: function(i) {
                this.indexA = i
                this.overlayA = true
            },
            previewTask: function () {

                GeneratorService
                    .generate( { content: this.ext_text.task } )
                    .then((res) => {
                        this.preview = res.data.content;
                        this.message = res.data.message;
                        this.success = true;
                        this.infoMessage = true;

                        this.taskOverlay = true

                        //initMathJax({}, () => { renderByMathjax(document.getElementById('task')); });
                        localStorage.setItem('data', this.ext_text.generateText() );
                    })
                    .catch((err) => {
                        this.message = err?.response?.data?.message || err.message;
                        this.success = false;
                        this.infoMessage = true;
                    });
            },
            saveText: function() {
                localStorage.setItem('data', this.text);

                this.createNewTask();
            },
            restoreText: function() {
                // TODO ?
            },


            // Variables
            addVariable: function() {
                let newVariable = new Variable("$newVar");
                newVariable.added = true;
                
                this.ext_text.task.variables.push(newVariable);
            },
            setVariableName: function(e) {
                this.ext_text.task.variables[this.indexV].name = e.target.innerText;
            },
            removeVariable: function(i) {
                this.ext_text.task.variables.splice(i, 1);
            },

            // Questions
            addQuestion: function() {
                this.ext_text.task.questions.push(new Question());
            },
            removeQuestion: function(i) {
                this.ext_text.task.questions.splice(i, 1);
            },

            // Answers
            addCorrect: function() {
                this.ext_text.task.answers[this.indexA].correct.push(new String(""));
            },
            removeCorrect: function(i) {
                this.ext_text.task.answers[this.indexA].correct.splice(i, 1);
            },
            addIncorrect: function() {
                this.ext_text.task.answers[this.indexA].incorrect.push(new String(""));
            },
            removeIncorrect: function(i) {
                this.ext_text.task.answers[this.indexA].incorrect.splice(i, 1);
            },

            parseText : function () {

                // TEXT
                this.ext_text.task.text = this.text;

                let tokens = tokenize(this.text);

                // VARIABLES
                this.variables = this.ext_text.extractVariables(tokens);

                // ANSWERS
                this.answers = this.ext_text.extractAnswers(tokens);

                // Extract answer from each question
                
                // Assume list of variables has changed
                // and set visiblity to false for all variables
                this.ext_text.task.answers.forEach((answer) => {
                    answer.visible = false;
                });
                // QUESTIONS
                this.ext_text.task.questions.forEach((question) => {

                    console.log('Q',question);
                    console.log(tokenize("Q: ", question.text));

                    this.ext_text.extractAnswers(tokenize(question.text));
                });

                let generated_text = this.ext_text.generateText();

                console.log(generated_text);
            }     
        }
    }
</script>

<style>
    [text-narrow] {
        line-height: 1.1 !important;
        font-size: 1rem;
    }

    .pointer {
        cursor: pointer !important;
    }

    .close-button {
        position: absolute !important;
        top: 0rem !important;
        right: 0rem !important;
    }

</style>