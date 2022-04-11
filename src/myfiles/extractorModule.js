import { Token } from "./tokenizer";
import {
  answerInfo,
  variableInfo,
  Task,
  Question,
  Variable,
  Answer,
} from "./taskHandler";

/*
  Class used to export data about variables 
  and generate math markup language code
*/
export class Extractor {
  constructor() {
    this.task = new Task();

    this.task_text = "";
    this.questions = [];

    this.parsedVariables = [];
    this.addedVariables = [];

    this.parsedAnswers = [];
  }

  // Save parsed variables
  addUniqueVars(tokens) {
    // Assume list of variables has changed
    // and set visiblity to false for all variables
    this.task.variables.forEach((variable) => {
      if (variable.added == false) {
        variable.visible = false;
      }
    });

    tokens.forEach((token) => {
      let variable_name = token.value;

      let variable = this.task.variables.find(
        (parsedVar) => parsedVar.name == variable_name
      );
      // Add all variables that aren't in the list already
      if (!variable) {
        variable = new Variable(variable_name);
        this.task.variables.push(variable);
      } else {
        // Set visiblity for parsed variables
        variable.visible = true;
      }
    });
  }

  // Save parsed answers
  addUniqueAnswers(tokens) {
    tokens.forEach((token) => {
      let answer_name = token.value;

      let answer = this.task.answers.find(
        (parsedAns) => parsedAns.name == answer_name
      );
      // Add all answers that aren't in the list already
      if (!answer) {
        answer = new Answer(answer_name);
        this.task.answers.push(answer);
      } else {
        // Set visiblity for parsed answers
        answer.visible = true;
      }
    });
  }

  // Extract variables from token stream
  extractVariables(tokens) {
    // Filter variables from tokens and add only once
    this.addUniqueVars(
      tokens.filter((token) => token.type == Token.types.variable)
    );

    return this.task.variables;
  }

  // Extract answers from token stream
  extractAnswers(tokens) {
    // Filter answers from tokens and add only once
    this.addUniqueAnswers(
      tokens.filter((token) => token.type == Token.types.answer)
    );

    return this.task.answers;
  }

  generateText() {
    let text = "";

    /* TEXT */
    // Add task text
    text = text.concat("#text \n", this.task.text, "\n\n");

    /* QUESTIONS */
    // Add questions
    this.task.questions.forEach((question) => {
      text = text.concat("#question \n", question.text, "\n\n");
    });
    if (this.task.questions.length == 0) {
      text = text.concat("#question \n\n");
    }

    /* DEFINITIONS */
    // Add definitions of parsed variables from given text and questions
    text = text.concat("#definitions \n");
    this.task.variables.forEach((variable) => {
      // Variable is up-to-date and could have been set by the user
      if (variable.visible) {
        // Definitions contains valid characters
        if (variable.definition.trim() != "") {
          // Add full defintion
          text = text.concat(variable.name, " = ", variable.definition, "\n");
        } else {
          // Add declaration only
          text = text.concat(variable.name, "\n");
        }
      }
    });

    // Add correct option(s) for each answer
    this.task.answers.forEach((answer) => {
      // Answer is up-to-date and could ave been set by the user
      if (answer.visible) {
        text = text.concat(answer.name, ".correct = [ \n");
        answer.correct.forEach((correct, i) => {
          if (i > 0) {
            text = text.concat(", \n");
          }

          text = text.concat(correct);
        });
        text = text.concat("\n ] \n");
      }
    });

    // Add incorrect option(s) for each answer
    this.task.answers.forEach((answer) => {
      // Answer is up-to-date and could ave been set by the user
      if (answer.visible) {
        text = text.concat(answer.name, ".incorrect = [ \n");
        answer.incorrect.forEach((incorrect, i) => {
          if (i > 0) {
            text = text.concat(", \n");
          }

          text = text.concat(incorrect);
        });
        text = text.concat("\n ] \n");
      }
    });

    /* RANGES */
    // Add ranges for variables
    // Add definitions of parsed variables
    text = text.concat("\n#ranges \n");
    this.task.variables.forEach((variable) => {
      console.log("NAME", variable.name);

      // Variable is up-to-date and could have been set by the user
      if (variable.visible) {
        // Variable can produce a valid range string
        if (
          variable.range.start != "" &&
          variable.range.end != "" &&
          variable.range.step != ""
        ) {
          // Add range defintion
          text = text.concat(
            variable.name,
            " = range(",
            variable.range.start,
            ",",
            variable.range.end,
            ",",
            variable.range.step,
            ")\n"
          );
        }
      }
    });

    this.task.answers.forEach((answer) => {
      console.log("NAME", answer.name);

      // Answer is up-to-date and could have been set by the user
      if (answer.visible) {
        // Answer can produce a valid range string
        if (answer.range.start != "" && answer.range.end != "") {
          // Add range defintion
          text = text.concat(
            answer.name,
            " = range(",
            answer.range.start,
            ",",
            answer.range.end,
            ",1)\n"
          );
        }
      }
    });

    text = text.concat("\n\n");

    console.log(text); // logging

    return text;
  }
}
