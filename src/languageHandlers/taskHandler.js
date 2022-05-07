/*
 * File: taskHandler.js
 * Description: Interprets the proposed language 
 *
 * Project: Bachelor's Thesis - Web system for Math tests creation
 * Author: xcziro00, David Czirok
 *
 * Last modified: 07-05-2022
 */

// import tokenizer
import { tokenize, Token } from "./tokenizer";
// import function to evaluate expressions
const math = require("mathjs");

// Task with concrete values
export class ConcreteTask {
  constructor() {
    this.text = "";
    this.questions = [];
    this.answers = new Map();
    this.variables = new Map();
  }
}

// Class that represents the questions
// of the given task
export class Question {
  constructor() {
    this.text = "";
  }
}

// Answer structure
export class Answer {
  constructor(_name) {
    this.name = _name;
    this.correct = [];
    this.incorrect = [];

    this.range = new Range();

    this.visible = true;
    this.hasErrors = false;
  }
}

// Variable structure
export class Variable {
  constructor(_name) {
    this.name = _name;
    this.definition = "";
    this.range = new Range();

    this.visible = true;
    this.added = false;

    this.hasError = false;
  }
}

// Represents the range of the variable
export class Range {
  constructor() {
    this.start = "";
    this.end = "";
    this.step = "";

    this.fullRange = function () {
      if (
        this.start.trim() == "" ||
        this.end.trim() == "" ||
        this.step.trim() == ""
      ) {
        return "";
      }

      return "(" + this.start + "," + this.end + "," + this.step + ")";
    };
  }
}

// Class that represents the task
// this will be saved in the database
export class Task {
  constructor() {
    // Content
    this.text = "";

    this.qIndex = -1;
    this.questions = [];

    this.vIndex = -1;
    this.variables = [];

    this.answers = [];
  }

  // Adding text to task
  addTaskText(_text) {
    this.text += " " + _text.toString();
  }

  // Add new question
  addNewQuestion() {
    this.questions.push(new Question());
    this.qIndex++;
  }

  // Add question text
  addQuestionText(_text) {
    this.questions[this.qIndex].text += " " + _text.trim("\n");
  }

  // Find answer by name
  findAnswer(_name) {
    return this.answers.find((a) => a.name == _name);
  }

  // Add new answer
  addNewAnswer(_name) {
    this.answers.push(new Answer(_name));
  }

  // Add new variable to task if not already in array
  addNewVariable(_name) {
    if (!this.variables.find((v) => v.name == _name)) {
      this.variables.push(new Variable(_name));
      this.vIndex++;
    }
  }

  setVariableIndex(_name) {
    this.vIndex = this.variables.findIndex((v) => v.name == _name);
  }

  addVariableDefinition(_definition) {
    this.variables[this.vIndex].definition = _definition;
  }

  findVariable(_name) {
    return this.variables.find((v) => v.name == _name);
  }
}

/**
 * Parses the markup language
 * 
 * @param {*} text 
 * @returns {Task} 
 */
export function parseMathLang(text) {
  // console.log(text); // Logging

  // First, tokenize the input file
  let tokens = tokenize(text);
  let lineNumber = 0;
  let i = 0;

  // console.log(tokens);

  // Create task object where the new task will be saved
  let task = new Task();

  // Error checking
  if (checkEndOfInput()) return task;

  parseText();
  if (task.error) return task;
  parseQuestions();
  if (task.error) return task;
  parseDefinitions();
  if (task.error) return task;
  parseRanges();

  // Trim whitespaces in question text
  task.questions.forEach((q) => (q.text = q.text.trim()));

  // console.log(task);

  return task;

  /* ------------------------------ */

  // Check end of input error
  function checkEndOfInput() {
    if (i == tokens.length) {
      task.error = true;
      task.errMsg = "Parser error: Unexpected end of input.";
    }

    return task.error;
  }

  // Parse the #text part of the given text
  function parseText() {
    // Text section starts with '#text'
    if (!checkTokenType(Token.types.keyword))
      tokenTypeError("Expected keyword, starting with #");
    if (!checkTokenValue("#text")) tokenValueError("Expected #text keyword");

    i++; // Move to next token
    skipSpaces();

    // Append text until the next keyword
    while (!checkEndOfInput() && !checkTokenType(Token.types.keyword)) {
      // Save variable when encountered
      if (checkTokenType(Token.types.variable)) {
        task.addNewVariable(tokens[i].value);
      }

      task.addTaskText(tokens[i].value);

      i++; // Move to next token
      skipSpaces();
    }
  }

  // Parse the #question parts of the text
  function parseQuestions() {
    // For each question in the text
    do {
      // Check keyword validity
      if (!checkTokenType(Token.types.keyword))
        tokenTypeError("Expected keyword, starting with #");
      if (!checkTokenValue("#question"))
        tokenValueError("Expected '#question' keyword");

      task.addNewQuestion();

      i++; // Move to next token
      skipSpaces();

      // Add question content
      while (!checkTokenType(Token.types.keyword)) {
        if (checkTokenType(Token.types.answer)) {
          task.addNewAnswer(tokens[i].value);
        }

        // Save variable when encountered
        if (checkTokenType(Token.types.variable)) {
          task.addNewVariable(tokens[i].value);
        }

        task.addQuestionText(tokens[i].value);

        i++; // Move to next token
        skipSpaces();
      }
    } while (
      checkTokenType(Token.types.keyword) &&
      checkTokenValue("#question")
    );
  }

  // Parse the #defintion part of the text
  function parseDefinitions() {
    if (!checkTokenType(Token.types.keyword))
      tokenTypeError("Expected keyword, starting with #");
    if (!checkTokenValue("#definitions"))
      tokenValueError("Expected '#definitions' keyword");

    i++; // Move to next token
    skipSpaces();

    // Until the next keyword
    while (!checkTokenType(Token.types.keyword)) {
      // Handle variable definition or declaration
      if (checkTokenType(Token.types.variable)) {
        // If variable was not added yet
        if (
          task.variables.find((v) => v.name == tokens[i].value) == undefined
        ) {
          task.addNewVariable(tokens[i].value);
          task.variables.at(-1).added = true;
        }

        // Find index of current variable to process
        task.setVariableIndex(tokens[i].value);

        i++; // Move to next token
        skipSpaces();

        // Variable definition
        if (checkTokenType(Token.types.operator.eq)) {
          i++; // Move to next token
          skipSpaces();

          let temp_def = "";
          while (!checkTokenType(Token.types.whitespace.newline)) {
            // Collect variable definition
            temp_def += " " + tokens[i].value;
            i++; // Move to next token
            skipSpaces();
          }

          task.addVariableDefinition(temp_def.trim());
          i++; // Move to next token
          skipSpaces();
        }
        // Variable declaration
        else if (!checkTokenType(Token.types.whitespace.newline)) {
          tokenTypeError("Expected a newline character '\\n'");
        }
      }

      // Answer assignment
      if (checkTokenType(Token.types.answer)) {
        // Find answer in questions answer
        let answer = task.findAnswer(tokens[i].value);
        if (answer == undefined)
          semanticError("Answer " + tokens[i].value + " is undefined.");

        // console.log("ANSW", answer.name);
        i++; // Move to next token
        skipSpaces();

        // Look for '.correct' or '.incorrect'
        if (!checkTokenType(Token.types.special.accessor))
          tokenTypeError("Expected accessor .correct or .incorrect");

        // Save answer accessor type
        let answerType = tokens[i].value;
        i++; // Move to next token
        skipSpaces();

        // Look for =
        if (!checkTokenType(Token.types.operator.eq))
          tokenTypeError("Expected an equal sign =");

        i++; // Move to next token
        skipSpaces();

        // Look for [
        if (!checkTokenType(Token.types.special.lBracket))
          tokenTypeError("Expected an opening bracket [");

        i++; // Move to next token
        skipSpaces();

        // Look for newline
        if (!checkTokenType(Token.types.whitespace.newline))
          tokenTypeError("Expected a newline character '\\n'");

        i++; // Move to next token
        skipSpaces();

        // Exclude ]
        if (checkTokenType(Token.types.special.rBracket))
          tokenTypeError("Expected a value between [ ] brackets");

        // console.log(answerType);

        // For each answer definition
        while (!checkTokenType(Token.types.special.rBracket)) {
          // Collect definition
          let answerDefinition = "";

          while (
            !checkTokenType(Token.types.special.comma) &&
            !checkTokenType(Token.types.whitespace.newline)
          ) {
            answerDefinition += tokens[i].value;
            i++; // Move to next token
          }

          if (checkTokenType(Token.types.special.comma)) i++; // Move to next token

          // Save definition based on accessor type
          if (answerType == ".correct" && answerDefinition != "") {
            answer.correct.push(answerDefinition);
          }
          if (answerType == ".incorrect" && answerDefinition != "") {
            answer.incorrect.push(answerDefinition);
          }

          i++; // Move to next token
          skipSpaces();
        }
      }

      i++; // Move to next token

      // console.log(!checkTokenType(Token.types.keyword));
    }
  }

  // Parses the #ranges part of the text
  function parseRanges() {
    if (!checkTokenType(Token.types.keyword))
      tokenTypeError("Expected keyword, starting with #");
    if (!checkTokenValue("#ranges"))
      tokenValueError("Expected '#ranges' keyword");

    i++; // Move to next token
    skipNewLines();
    skipSpaces();

    while (i < tokens.length) {
      if (
        !checkTokenType(Token.types.variable) &&
        !checkTokenType(Token.types.answer)
      )
        tokenTypeError("Expetected variable or answer");

      // Load variable (or answer)
      let variable;
      if (checkTokenType(Token.types.variable)) {
        variable = task.findVariable(tokens[i].value);
      } else {
        variable = task.findAnswer(tokens[i].value);
      }
      if (variable == undefined)
        semanticError("Variable " + tokens[i].value + " is undefined.");

      i++; // Move to next token
      skipSpaces();

      if (!checkTokenType(Token.types.operator.eq))
        tokenTypeError("Expected opeator =");
      i++; // Move to next token
      skipSpaces();

      if (!checkTokenType(Token.types.text)) {
        tokenTypeError("Expected text type");
      }
      if (!checkTokenValue("range")) {
        tokenValueError("Expected 'range' text");
      }
      i++; // Move to next token
      skipSpaces();

      // (
      if (!checkTokenType(Token.types.special.lParenth))
        tokenTypeError("Expected left parenthesis (");
      i++; // Move to next token
      skipSpaces();

      // start
      if (!checkTokenType(Token.types.number))
        tokenTypeError("Expected a number");
      variable.range.start = tokens[i].value;
      i++; // Move to next token
      skipSpaces();

      if (!checkTokenType(Token.types.special.comma))
        tokenTypeError("Expected comma separator ,");
      i++; // Move to next token
      skipSpaces();

      // end
      if (!checkTokenType(Token.types.number))
        tokenTypeError("Expected a number");
      variable.range.end = tokens[i].value;
      i++; // Move to next token
      skipSpaces();

      if (!checkTokenType(Token.types.special.comma))
        tokenTypeError("Expected comma separator ,");
      i++; // Move to next token
      skipSpaces();

      // step
      if (!checkTokenType(Token.types.number))
        tokenTypeError("Expected a number");
      variable.range.step = tokens[i].value;
      i++; // Move to next token
      skipSpaces();

      // )
      if (!checkTokenType(Token.types.special.rParenth))
        tokenTypeError("Expected closing right parenthesis )");
      i++; // Move to next token
      skipSpaces();

      skipNewLines();
    }
  }

  function skipNewLines() {
    while (
      i < tokens.length &&
      (checkTokenType(Token.types.whitespace.newline) ||
        checkTokenType(Token.types.whitespace.space))
    ) {
      i++;
    }
  }

  function skipSpaces() {
    while (i < tokens.length && checkTokenType(Token.types.whitespace.space)) {
      i++;
    }
  }

  /* ------------------------------------------------- */
  // Checkers
  function checkTokenType(type) {
    if (i >= tokens.length) return false;
    return tokens[i].type == type ? true : false;
  }

  function checkTokenValue(value) {
    if (i >= tokens.length) return false;
    return tokens[i].value == value ? true : false;
  }

  // Errors
  function tokenTypeError(_errMsg = "Type error message...") {
    throw { type: "Token Type Error", message: _errMsg };
  }
  function tokenValueError(_errMsg = "Value error message...") {
    throw { type: "Token Value Error", message: _errMsg };
  }

  function semanticError(_errMsg) {
    throw { type: "Semantic Error", message: _errMsg };
  }
}

/* --------------------------------- */
