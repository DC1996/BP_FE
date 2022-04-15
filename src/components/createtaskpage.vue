<template>
    <v-container id="task" class="d-flex flex-column justify-start align-center mt-2 pb-0 b-g rounded-lg" style="position: relative;">

        <v-btn elevation="1" large color="primary" icon style="position: absolute; left: 0.5rem; background-color: white"
            class="px-6 py-2 mx-2 no-uppercase" @click="helpDialog = true"> 
            <v-icon>mdi-help-circle-outline</v-icon>
        </v-btn>

        <!-- Task name -->        
        <h4 class="text-h5 custom-font my-4 font-weight-bold"> {{ this.name }} </h4>

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

            <div style="height: 220px; overflow-y: auto">
            <!-- Variables chips section -->
            <h3 class="ml-2 mb-1"> Variables </h3>          
                <div class="d-flex flex-row flex-wrap align-center ma-0 pa-0 minus">
                    <div v-for="(variable, ind) in ext_text.task.variables" :key="ind + 'v'" class="ma-0 pa-0">
                        <v-chip v-if="variable.visible" @click="variableInfo(ind)"
                            color="primary" label class="mx-2 my-1 px-6 py-4 pointer elevation-1">
                            {{ variable.name.substr(1) }}
                        </v-chip>
                    </div>                    
                    
                    <!-- Add variable button -->
                    <div class="mx-2 my-1">
                        <v-btn @click="addVariable()" depressed class="no-uppercase">
                            <v-icon>mdi-plus</v-icon>
                            Add Variable
                        </v-btn>
                    </div>
                </div>

                <!-- Answers chips section -->
                <h3 class="ml-2">Answers</h3>
                    <div class="d-flex flex-row flex-wrap align-center ma-0 pa-0 minus">
                        <p class="text-body-2 mx-2" v-if="ext_text.task.answers.length == 0" >No Answers found. Add answers to questions. </p>
                        <div v-for="(answer, i) in ext_text.task.answers" :key="i + 'a'" class="ma-0 pa-0">
                            <v-chip v-if="answer.visible" @click="answerInfo(i)"
                                color="primary" label class="mx-2 my-1 px-6 py-4 pointer">
                                {{ answer.name.substr(1) }}
                            </v-chip>
                        </div>
                    </div>
            </div>

            <!-- PREVIEW -->
            <v-overlay :value="taskOverlay" :light="true" :dark="false">
                <v-sheet
                    elevation="4" width="650"
                    style="height: 600px; overflow-y: auto"
                    class="pa-4 ma-2 d-flex flex-column justify-flex-start align-flex-start rounded-lg">

                    <h4 class="mx-2 pa-1 text-h5 d-flex justify-space-between text-h5">
                        Task preview 
                        <v-btn plain icon @click="taskOverlay = false" class="pa-0 shrink">
                        <v-icon color="danger">mdi-close</v-icon>
                    </v-btn>
                    </h4>

                    <h3 class="ma-2 pa-1"> {{ preview.text.trim() }} </h3>
                    <div id="latex-task" class="d-flex flex-column ma-2 pa-1" v-for="(q, i) in preview.questions" :key="'q' + i">
                        
                        <h4 class="ma-1"> {{ replaceAnswers(q.text.trim()) }} </h4>

                        <div id="latex-task" class="ma-1 pa-1" v-for="(a, i) in q.answers" :key="'a' + i">
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
                <div class="d-flex flex-column justify-start" style="height: 300px; overflow-y: auto">
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
            <div class="d-flex flex-row mt-2 mb-1 justify-self-end justify-end">
                <v-btn depressed elevation="0" large class="px-3 py-1 mx-2 no-uppercase" @click="parseText">Evaluate</v-btn>
                <v-btn depressed elevation="0" large class="px-3 py-1 mx-2 no-uppercase" @click="previewTask">Preview</v-btn>
                <v-btn elevation="2" large color="primary"
                    class="px-6 py-2 mx-2 no-uppercase" @click="getCategories(); overlaySave = true"> Save
                </v-btn>
                <!-- <v-btn class="mx-1" @click="restoreText">Restore</v-btn> -->
            </div>

            </v-col>
        </v-container>

        <!-- Make this a dialog...variable dialog -->
        <v-overlay tabindex="0" @keydown.esc="overlayV = false"
            :value="overlayV" :light="true" :dark="false" v-if="ext_text.task.variables.length != 0">
            <v-sheet 
                elevation="4" width="500" 
                class="pa-4 ma-2 mt-0 pt-2 d-flex flex-column justify-flex-start align-flex-start rounded-lg">
                <v-form v-model="variableOk">
                
                <div v-if="variable.added" class="ma-2 mt-3 d-flex justify-space-between">
                    <v-text-field :rules="[v => (v.trim().length != 0) || 'Name must have atleast 1 character', v => (/^[0-9a-zA-Z_]+$/.test(v)) || 'Name must contain only letters, numbers and underscores']" outlined label="Name" dense v-model="variable.name"></v-text-field>
                    <v-btn plain icon @click="overlayV = false" class="ml-2 pa-0 shrink">
                        <v-icon color="danger">mdi-close</v-icon>
                    </v-btn>
                </div>
                <h2 class="ma-2 mt-3 d-flex justify-space-between" v-if="!variable.added"> 
                    {{ variable.name.length != 0 ? variable.name.toString().substr(1) : null}} 
                    <v-btn plain icon @click="overlayV = false" class="ml-2 pa-0 shrink">
                        <v-icon color="danger">mdi-close</v-icon>
                    </v-btn>
                </h2>
                
                <p class="ma-2"> Definition </p>
                <v-text-field 
                    label="" placeholder="E.g.: ( $a * 2 ) + 1" 
                    
                    v-model="variable.definiton"
                    outlined dense class="shrink mx-2"> 
                    {{ variable.definition }} 
                </v-text-field>
                
                <p class="ma-2 mt-0"> Range {{ variable.range.fullRange() }} </p>
                <v-row class="d-flex flex-row flex-nowrap px-3">
                    <v-text-field 
                        label="Start" v-model="variable.range.start" 
                        outlined dense class="shrink mx-2 mt-3">
                    </v-text-field>
                    <v-text-field 
                        label="End" v-model="variable.range.end" 
                        outlined dense class="shrink mx-2 mt-3">
                    </v-text-field>
                    <v-text-field 
                        label="Step" v-model="variable.range.step"
                        outlined dense class="shrink mx-2 mt-3">
                    </v-text-field>
                </v-row>

                <v-row class="d-flex justify-self-end mx-1">
                    <!-- Remove variable icon -->
                    <v-tooltip right>
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="error" @click="removeVariable(indexV); overlayV = false" v-bind="attrs" v-on="on" icon class="mb-2 no-uppercase" depressed text> 
                                <v-icon>mdi-delete-empty</v-icon>
                            </v-btn>
                        </template>
                        <span>Delete variable</span>
                    </v-tooltip>
                    
                    <v-spacer></v-spacer>
                    <v-btn color="black" class="mx-2 mb-2 no-uppercase" outlined text @click="overlayV= false"> Cancel </v-btn>
                    <v-btn color="primary" :disabled="!variableOk" class="mx-1 mb-2 no-uppercase" @click="setVariableInfo()"> Save </v-btn>
                </v-row>
                </v-form>
            </v-sheet>
        </v-overlay>

        <!-- Answer overlay -->
        <v-overlay
            :light="true" :dark="false"
            :value="overlayA" v-if="ext_text.task.answers.length != 0">
            <v-sheet elevation="4" width="500" height="80vh"
            class="pa-4 ma-2 mt-0 pt-2 d-flex flex-column justify-flex-start align-flex-start rounded-lg overflow-y-auto">
            <!-- Close icon -->
            <h2 class="d-flex justify-space-between ma-2 mt-3"> 
                {{ answer.name.substr(1) }}
                <v-btn plain icon @click="overlayA = false" class="pa-0 mr-n2 shrink">
                    <v-icon color="danger">mdi-close</v-icon>
                </v-btn>
            </h2>

            <p class="ma-2 mt-0"> Range {{ answer.range.fullRange() }} </p>
            <v-row class="d-flex flex-row flex-nowrap px-3 shrink">
                <v-text-field 
                    label="Start" v-model="answer.range.start" 
                    outlined dense class="shrink mx-2 mt-3">
                </v-text-field>
                <v-text-field 
                    label="End" v-model="answer.range.end" 
                    outlined dense class="shrink mx-2 mt-3">
                </v-text-field>
            </v-row>

            <p class="ma-2 mt-0">Correct</p>
            <div 
                class="d-flex flex-row" 
                v-for="(el, i) in answer.correct" :key="'el_c' + i">
                <v-text-field 
                    label="" 
                    placeholder="E.g.: ( $a * 2 ) + 1" 
                    v-model="answer.correct[i]"
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
                v-for="(el, i) in answer.incorrect" :key="'el_ic' + i">
                <v-text-field 
                    label="" 
                    placeholder="E.g.: ( $a * 2 ) + 1" 
                    v-model="answer.incorrect[i]" 
                    outlined dense class="mx-2 my-0"> 
                    {{ answer.incorrect }}
                </v-text-field>
                <v-btn 
                    @click="removeIncorrect(i)"
                    icon plain color="red" class="mx-2">
                    <v-icon>mdi-delete-empty</v-icon>
                </v-btn>
            </div>
            <v-btn depressed class="mx-2" @click="addIncorrect()">
                <v-icon>mdi-plus</v-icon>
                Add incorrect answer
            </v-btn>
            
            <v-row class="d-flex justify-self-end align-end mx-1">
                <!-- Delete answer icon -->
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="error" @click="removeAnswer(indexA); overlayA = false" v-bind="attrs" v-on="on" icon class="mb-4 no-uppercase" depressed text> 
                            <v-icon>mdi-delete-empty</v-icon>
                        </v-btn>
                    </template>
                    <span>Delete answer</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn color="black" class="mx-2 my-4 mt-6 no-uppercase" outlined text @click="overlayA= false"> Cancel </v-btn>
                <v-btn dark color="primary" class="mx-1 my-4 mt-6 no-uppercase" @click="setAnswerInfo()"> Save </v-btn>
            </v-row>

            </v-sheet>
        </v-overlay>

        <!-- Answer type options dialog -->
        <v-dialog v-model="overlaySave" width="450" :retain-focus="false">
            <v-card class="d-flex flex-column rounded-lg pt-2">
                <p class="pb-4 my-2 font-weight-bold text-h5 align-self-center"> Task details</p>

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

        <!-- Task creation explanation dialog -->
        <v-dialog v-model="helpDialog" width="80vw" :retain-focus="false">
            <v-card class="d-flex flex-column rounded-lg pt-2">
                <v-card-title class="text-h5 d-flex justify-space-between"> 
                    How to write tasks? 
                    <v-btn plain icon @click="helpDialog = false" class="pa-0 mr-n2 shrink">
                    <v-icon color="danger">mdi-close</v-icon>
                </v-btn>
                </v-card-title>
                <v-card-text> Task creation can be divided into four parts. Each part is explained below and can be observed in the example tasks. <br>
                The example tasks can be found in the <span class="font-weight-bold">Your tasks</span> page.</v-card-text>
                <v-container class="py-0 my-0">
                    <v-row class="py-0 my-0">
                        <v-col cols="6" class="py-0 my-0">
                            <v-card-text>
                                <span class="text-underline text-body-1">1. Task text </span>  <br>
                                You start by writing the text that describes the problem, 
                                gives instructions and provides context. <br>
                                It can contain any amount of characters (including zero) and <span class="font-weight-bold">Variables</span>. <br>
                            </v-card-text>
                            <v-textarea readonly text-narrow spellcheck="false" background-color="white" color="black"
                                placeholder="Jamie has a big house and a barn. In his barn he has $x horses and $y cows. He sells two cows and one horse.'"
                                class="text-h3 pb-2 mx-4" solo no-resize hide-details rows="4">
                            </v-textarea>
                        </v-col>
                        <v-col cols="6" class="py-0 my-0">
                            <v-card-text>
                                <span class="text-underline text-body-1">2. Questions</span> <br>
                                Then you continue by writing questions to which you expect 
                                your students to know the answer. <br>
                                A task can have an unlimited number of questions. <br>
                                Questions can contain any amount of characters, 
                                <span class="font-weight-bold">Variables</span> and 
                                <span class="font-weight-bold">must contain one or more Answers</span>. <br>
                                <v-text-field readonly
                                    placeholder="How many horses does Jamie have? @horses"
                                    solo hide-details color="error"
                                    class="my-1 d-flex flex-grow-1">
                                    <template v-slot:append>
                                        <v-icon color="error">mdi-delete-empty</v-icon>
                                    </template>
                                </v-text-field>
                            </v-card-text>
                        </v-col>
                        <v-col cols="12" class="py-0 my-0">
                            <v-card-text>
                                <span class="text-underline text-body-1">3. Variables </span>  <br>
                                After writing down your questions it's time to define Variables.
                                Variables represent the core of task creation. <br>
                                A Variable is identified with the <span class="font-weight-bold">$</span> (dollar sign) 
                                starting character and can be followed by letters, numbers and underscores. <br>
                                It acts as a placeholder for an actual value. <br>
                                All these represent valid Variables: 
                                <span class="font-weight-bold"> $x, $y1, $new_var, $long_variable_name123, ...</span> <br>
                                Few important things to know about <span class="font-weight-bold"> Variables: </span> <br>
                                <span style="text-decoration: underline">Each occurrence</span> of a 
                                <span class="font-weight-bold">Variable</span> in the task text or question
                                <span style="text-decoration: underline">will be replaced by an actual value</span> 
                                when the task is used in a test later on.
                                <span class="text-underline">Variables</span> that are used <span class="text-underline"> in the task text are automatically 
                                added into the list of Variables</span> and that is why it's recommended 
                                to start by defining the task text first. <br>
                                <span style="font-style: italic">Example: If Task text = "Jamie has $x horses" then Variables = "$x"</span> <br><br>
                                You can configure what values will be susbstituted 
                                for a given variable by clicking on a <v-chip label color="primary"> Variable </v-chip> under the Variables section 
                                which opens a dialog where you can set the following properties. <br>

                                <v-row>
                                <v-col cols="6" class="d-flex justify-center align-center">
                                <v-sheet elevation="3" width="400" class="pa-4 ma-2 mt-0 pt-2 d-flex flex-column justify-flex-start align-flex-start rounded-lg">

                                    <h2 class="ma-2 mt-3"> 
                                        Variable name
                                    </h2>
                                    
                                    <p class="ma-2"> Definition </p>
                                    <v-text-field 
                                        label="" placeholder="E.g.: ( $x * 2 ) + 1" 
                                        outlined dense class="shrink mx-2"> 
                                    </v-text-field>
                                    
                                    <p class="ma-2 mt-0"> Range </p>
                                    <v-row class="d-flex flex-row flex-nowrap px-3">
                                        <v-text-field readonly
                                            label="Start" placeholder="1"
                                            outlined dense class="shrink mx-2 mt-3">
                                        </v-text-field>
                                        <v-text-field readonly
                                            label="End" placeholder="100"
                                            outlined dense class="shrink mx-2 mt-3">
                                        </v-text-field>
                                        <v-text-field readonly
                                            label="Step" placeholder="E.g.: 100, 1, 0.1"
                                            outlined dense class="shrink mx-2 mt-3">
                                        </v-text-field>
                                    </v-row>
                                </v-sheet>
                                </v-col>
                                <v-col cols="6">
                                    <span class="font-weight-bold text-underline">Definition</span> - a predefined value or expression to be calculated. <br>
                                Expressions can contain other Variables.<br>  
                                Example: We have a variable named $x, if we set its definiton to: <br>
                                <ul>
                                    <li>"2" - each occurrence of $x in a text will be replaced by the value "2" </li>
                                    <li>"$y + 2" - each occurrence of $x in a text will be replaced by the value which will be 
                                        substituted for the variable $y plus 2, that means if $y is 2, $x will be replaced 
                                        by the value 4 </li>
                                    <li>"sin($z) + 2" - each occurrence of $x will be replaced by the sinus value of $z + 2</li>
                                </ul>
                                <br>
                                <span class="font-weight-bold text-underline">Range</span> - a randomly selected number within the specified range. <br>
                                Range is defined by a Start, End and Step value.
                                The Start and End values define the limits of the range. 
                                The Step value defines the precision of the resulting number.
                                <span style="font-style: italic">
                                Example: Setting the following configuration (1, 10, 0.1)(start, end, step) 
                                will yield numbers in the range 1, 10 (included) rounded to nearest decimal value with the specified precision.
                                (1.1, 2.3, 5.0, 3.8, ...)
                                
                                </span>
                                </v-col>
                                </v-row>
                            </v-card-text>
                        </v-col>
                        <v-col cols="12" class="py-0 my-0">
                            <v-card-text>
                                <span class="text-underline text-body-1">4. Answers </span>  <br>
                                After defining the necessary variables you can move onto defining Answers. <br>
                                Answers are identified by the <span class="font-weight-bold">@</span> (at) starting character, which can be followed by letters, numbers and underscores (same as Variables). <br>
                                All these represent valid Answers: <span class="font-weight-bold"> @answer, @horse_count, @result1, ... </span> <br>
                                It serve as a way to identify which answer options should belong to a given question. <br>
                                In the actual task, the Answer is not visible in the text. <br>
                                An Answer should always be used in a question. After specifying an Answer in a question it is added under the Answers section. <br>
                                By clicking on an <v-chip label color="primary"> Answer </v-chip> you open a dialog with the following options. <br><br>

                                <v-row>
                                <v-col cols="6">
                                    <span class="font-weight-bold text-underline">Range</span> - defines the limits of the generated correct answer. <br>
                                All generated correct answers must confine into the defined limits.
                                When left empty, no restrictions will apply to the generated answers.<br><br>

                                <span class="font-weight-bold text-underline">Correct</span><br>
                                In this section you define the value or expression that represents the correct answer or answers.
                                The expression should correspond to the equation that yields the correct answer to the question asked.<br>
                                You can use Variables to build the expression, or use static values.<br>
                                <span style="font-style: italic"> Following the example problem, the equation $x - 1, would yield the correct answer option to the question 'How many horses does Jamie have?'</span>
                                <br><br>


                                <span class="font-weight-bold text-underline">Incorrect</span><br>
                                In this section you define the values or expressions that represent the incorrect answers.
                                The expressions can include equations that yield an answer with an error the student could have made.
                                You can use Variables to build the expression, or use static values.<br>
                                <span style="font-style: italic"> Following the example problem, the equation $x - 2, would yield an incorrect answer option to the question 'How many horses does Jamie have?'. 'Simulating' a less atentive student that mixes up the number of sold horses with the number of sold cows.<br><br> 
                                Static values can be used to create tasks with questions that focus on testing the students knowledge about certain facts or definitions. <br>
                                Task 'Example2 - Static' demonstrates such a task.
                                </span>


                                
                                </v-col>
                                <v-col cols="6" class="d-flex justify-center align-center">
                                <v-sheet elevation="3" width="500" height="500px"
                                    class="pa-4 ma-2 mt-0 pt-2 d-flex flex-column justify-flex-start align-flex-start rounded-lg overflow-y-auto">
                                    <h2 class="ma-2 mt-3"> 
                                        Answer name
                                    </h2>

                                    <p class="ma-2 mt-0"> Range </p>
                                    <v-row class="d-flex flex-row flex-nowrap px-3 shrink">
                                        <v-text-field readonly 
                                            label="Start" placeholder="10"
                                            outlined dense class="shrink mx-2 mt-3">
                                        </v-text-field>
                                        <v-text-field readonly
                                            label="End" placeholder="100"
                                            outlined dense class="shrink mx-2 mt-3">
                                        </v-text-field>
                                    </v-row>

                                    <p class="ma-2 mt-0">Correct</p>
                                    <div class="d-flex flex-row">
                                        <v-text-field 
                                            label="" placeholder="$x - 1" outlined dense class="mx-2 my-0"> 
                                        </v-text-field>
                                        <v-btn icon plain color="red" class="mx-2"><v-icon>mdi-delete-empty</v-icon></v-btn>
                                    </div>
                                    <v-btn depressed class="mx-2">
                                        <v-icon>mdi-plus</v-icon>Add correct answer
                                    </v-btn>

                                    
                                    <p class="ma-2">Incorrect</p>
                                    <div 
                                        class="d-flex flex-row" 
                                        v-for="(el, i) in ['$x - 2', 'E.g.: $x + 2, Pythagoras']" :key="'el_ic' + i">
                                        <v-text-field 
                                            label="" readonly
                                            :placeholder="el"
                                            outlined dense class="mx-2 my-0">
                                        </v-text-field>
                                        <v-btn icon plain color="red" class="mx-2">
                                            <v-icon>mdi-delete-empty</v-icon>
                                        </v-btn>
                                    </div>
                                    <v-btn depressed class="mx-2" @click="addIncorrect">
                                        <v-icon>mdi-plus</v-icon> Add incorrect answer
                                    </v-btn>
                                    
                                    </v-sheet>
                                </v-col>
                                </v-row>
                            </v-card-text>
                        </v-col>
                    </v-row>
                </v-container>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dark class="no-uppercase" color="primary" @click="helpDialog = false"> Close </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
    import { tokenize, Token } from "../myfiles/tokenizer.js"
    import { parseMathLang, Question, ConcreteTask, Variable, Answer } from "../myfiles/taskHandler"
    import { Extractor } from "../myfiles/extractorModule";

    import MathJax, { initMathJax, renderByMathjax } from "mathjax-vue";
    import { cloneDeep } from 'lodash';

    import TaskDataService from "../services/taskDataService";
    import GeneratorService from "../services/generatorService";
    import CategoryDataService from "../services/categoryDataService.js";

    import * as math from 'mathjs';

    export default {
        data() {   
            return {
                taskCategories: [],
                selectedTaskCategories: [],

                variableOk: false,
                
                name: "New Task",
                taskName: "",
                taskGrade: null,
                text: "",
                task_text: "",

                formula: '$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$',

                ext_text: new Extractor(),
                preview: new ConcreteTask(),
                
                variables: [],
                variable: new Variable(''),
                answer: new Answer(''),
                questions: [],
                answers: [],

                overlayV: false,
                overlayA: false,
                overlayAddV: false,
                overlaySave: false,
                taskOverlay: false,
                helpDialog: false,
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

                let cleanText = "";
                try {
                    cleanText = _qText.replaceAll(Token.types.gAnswer, "").replaceAll("=", "").trim();
                    setTimeout( () => renderByMathjax(document.getElementById("task")), 100 ) ;
                    return '$'.concat(math.parse(cleanText).toTex()).concat('$');
                    //return cleanText;
                } catch(error) {
                    //return _qText;
                    return cleanText;
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

            // opens variable setting dialog
            variableInfo : function(i) {
                this.indexV = i;
                this.variable = cloneDeep(this.ext_text.task.variables[i]);
                if(this.variable.added) {
                    this.variable.name = this.variable.name.substr(1);
                }
                this.overlayV = true;
            },
            // close and save edited values
            setVariableInfo: function() {
                if(this.variable.added) {
                    this.variable.name = '$'.concat(this.variable.name);
                }
                this.ext_text.task.variables[this.indexV] = cloneDeep(this.variable);
                this.overlayV = false;
            },
            // opens answers setting dialog
            answerInfo: function(i) {
                this.indexA = i
                this.answer = cloneDeep(this.ext_text.task.answers[i]);
                this.overlayA = true;
            },
            // close and save edited values
            setAnswerInfo: function() {
                this.ext_text.task.answers[this.indexA] = cloneDeep(this.answer);
                this.overlayA = false;
            },
            // opens preview task dialog
            previewTask: function () {

                GeneratorService
                    .generate( { content: this.ext_text.task } )
                    .then((res) => {
                        this.preview = res.data.content;
                        this.message = res.data.message;
                        this.$store.dispatch('showMessage', {message: this.message});

                        this.taskOverlay = true

                        renderByMathjax(document.getElementById("latex-task"));
                        localStorage.setItem('data', this.ext_text.generateText() );
                    })
                    .catch((err) => {
                        this.message = err?.response?.data?.message || err.message;
                        this.$store.dispatch('showMessage', {message: this.message, success: false});
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
            removeAnswer(i) {
                this.ext_text.task.answers.splice(i, 1);
            },
            addCorrect: function() {
                this.answer.correct.push(new String(""));
            },
            removeCorrect: function(i) {
                this.answer.correct.splice(i, 1);
            },
            addIncorrect: function() {
                this.answer.incorrect.push(new String(""));
            },
            removeIncorrect: function(i) {
                this.answer.incorrect.splice(i, 1);
            },

            parseText : function () {

                // TEXT
                this.ext_text.task.text = this.text;

                let tokens = tokenize(this.text);

                console.log("TOKENS: ",tokens);

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

                    //console.log('Q',question);
                    //console.log(tokenize("Q: ", question.text));

                    let questionTokens = tokenize(question.text);

                    this.ext_text.extractAnswers(questionTokens);
                    tokens = tokens.concat(questionTokens);
                });

                console.log("ALL TOKENS: ", tokens);

                // VARIABLES
                this.variables = this.ext_text.extractVariables(tokens);

                try{
                    let generated_text = this.ext_text.generateText();
                    this.$store.dispatch('showMessage', {message: "Successfuly evaluated!"});
                    console.log(generated_text);
                } catch(err) {
                    this.$store.dispatch('showMessage', {message: err.message, success: false});
                }
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