/******************
 * tokenizer.js
 * 
 * Implements Token class and tokenize
 * function that performs a lexical analysis
 * of the given language
 * 
*/

// Represents an extracted token from
// the token stream
export class Token
{
    /* Properties */
    constructor(_type, _value)
    {
        this.type = _type;
        this.value = _value;
    }

    /* Token types as pseudo enums */
    static types = {
        // Error handling
        undefined :  undefined,

        // Variable
        vSign :      "$",
        variable :   /[a-zA-Z0-9_]/,
        gVariable :  /\$[a-zA-Z0-9]+/g,
        
        // Answer
        aSign :      "@",
        answer :     /[a-zA-Z0-9_]/,
        gAnswer :    /@[a-zA-Z0-9]+/g,

        // Keyword
        kSign :      "#",
        keyword:     /[a-z]/,
        keywords :    { 
            text: "text", 
            question: "question", 
            definitions: "definitions", 
            ranges: "ranges" 
        },

        // Basic types
        number:     /([0-9])+/,
        text:       /([a-zA-Z0-9_])/,

        // Whitespace
        whitespace : { 
            space: ' ', 
            tabulator: '\t', 
            newline: '\n'
        },

        // Operators
        operator : {
            eq: '=',
            add: '+',
            sub: '-',
            mul: '*',
            div: '/',
            pow: '^',
        },
        special : {
            rParenth: ')',
            lParenth: '(',
            rBracket: ']',
            lBracket: '[',

            dot : '.',
            accessor: '.',
            comma : ',',
        }
    }


}

// Automata states
export const START = 0, VARIABLE = 11, KEYWORD = 22, ANSWER = 33, TEXT = 44;

/*
    Create tokens from the input text.
    Input: data - markup as a string
    Output: tokens - array of tokens
*/
export function tokenize(data)
{    
    // Initialize buffer and tokens array
    var buffer = ""
    var tokens = [];
    var lineNum = 0;

    var STATE = START;
    for ( var i = 0; i < data.length; i++ ) 
    {
        var character = data[i];

        //console.log( character );

        switch ( STATE ) 
        {
            case START:
            {
                // 'Append' first character
                buffer = character;

                // Analyze character
                switch ( character )
                {
                    case Token.types.vSign : { 
                        STATE = VARIABLE; 
                        break; 
                    }

                    case Token.types.kSign : { 
                        STATE = KEYWORD;  
                        break; 
                    }

                    case Token.types.aSign : { 
                        STATE = ANSWER;   
                        break; 
                    }

                    case Token.types.whitespace.space : break;
                    case Token.types.whitespace.tabulator : break;
                    case Token.types.whitespace.newline : 
                        {  tokens.push( new Token(Token.types.whitespace.newline, character)); break; }

                    case Token.types.special.lParenth : {  
                        tokens.push( new Token(Token.types.special.lParenth, character)); 
                        break;
                    }
                    case Token.types.special.rParenth : {  
                        tokens.push( new Token(Token.types.special.rParenth, character));
                        break;
                    }
                    case Token.types.special.lBracket : {  
                        tokens.push( new Token(Token.types.special.lBracket, character)); 
                        break; 
                    }
                    case Token.types.special.rBracket : {  
                        tokens.push( new Token(Token.types.special.rBracket, character)); 
                        break; 
                    }
                    case Token.types.operator.add : {  
                        tokens.push( new Token(Token.types.operator.add, character)); 
                        break; 
                    }
                    case Token.types.operator.sub : {  
                        tokens.push( new Token(Token.types.operator.sub, character)); 
                        break; 
                    }
                    case Token.types.operator.div : {  
                        tokens.push( new Token(Token.types.operator.div, character)); 
                        break; 
                    }
                    case Token.types.operator.mul : {  
                        tokens.push( new Token(Token.types.operator.mul, character)); 
                        break; 
                    }
                    case Token.types.special.comma : {  
                        tokens.push( new Token(Token.types.special.comma, character)); 
                        break; 
                    }
                    case Token.types.operator.eq : {  
                        tokens.push( new Token(Token.types.operator.eq, character)); 
                        break; 
                    }
                    case Token.types.operator.pow : {  
                        tokens.push( new Token(Token.types.operator.pow, character)); 
                        break; 
                    }

                    default: 
                    { 
                        // Lookahead for the next character
                        if ( /[\s$#@()+\-\^/*,=\[\]]/.test( data[i+1] ) ) { // eslint-disable-line
                            
                            if ( ! isNaN( +buffer ) ) 
                            {
                                tokens.push(new Token(Token.types.number, buffer));
                            }
                            else 
                            { 
                                tokens.push(new Token(Token.types.text, buffer));
                            }
                            
                            break;
                        }

                        STATE = TEXT; 
                        break;
                    }
                }   
                break;
            }

            // Handle variabes ( starting with $ )
            case VARIABLE: 
            {
                // Test current character
                if ( Token.types.variable.test( character ) ) // eslint-disable-line
                {
                    buffer += character;

                    // Lookahead to determine next token  
                    if ( (!( Token.types.variable.test(data[i+1]) )) || (i == data.length-1)) // eslint-disable-line
                    {
                        tokens.push(new Token(Token.types.variable, buffer));
                        STATE = START;
                        break;
                    }
                    
                    STATE = VARIABLE;
                    break; 
                }
                else 
                {
                    tokens.push(buffer);
                    STATE = START;
                    break;
                }
            }

            // Handle keywords ( starting with # )
            case KEYWORD: 
            {
                // Test current character
                if ( Token.types.keyword.test( character ) ) // eslint-disable-line
                {
                    buffer += character;

                    // Lookahead to determine next token
                    if ( (!( Token.types.keyword.test(data[i+1]) )) || (i == data.length-1) ) // eslint-disable-line
                    {
                        tokens.push(new Token(Token.types.keyword, buffer));
                        STATE = START;
                        break;
                    }
                    
                    STATE = KEYWORD;
                    break;
                }
                else
                {
                    tokens.push(new Token(Token.types.kSign, buffer));
                    STATE = START;
                    break;
                }
            }

            // Handle answer ( starts with @ )
            case ANSWER:
            {
                // Test current character 
                if ( Token.types.answer.test( character ) ) // eslint-disable-line
                {
                    buffer += character;

                    // Lookahead to determine next token
                    if ( (!( Token.types.answer.test(data[i+1]) )) || (i == data.length-1)) // eslint-disable-line
                    {    
                        tokens.push(new Token(Token.types.answer, buffer));
                        STATE = START;
                        break;
                    }
                    
                    STATE = ANSWER;
                    break; 
                }
                else 
                {
                    tokens.push(new Token(Token.types.aSign, buffer));
                    STATE = START;
                    break;
                }
            }

            // Handle text
            case TEXT: 
            {
                // Lookahead for next character
                // determine whether there are more character to the text or not
                // if any of these return true then text ended
                if( /[\s$#@()+\-\^/*,=\[\]]/.test( data[i+1] ) ) // eslint-disable-line
                {
                    buffer += character;

                    // check if we hit a number
                    if ( ! isNaN( +buffer ) ) 
                    {
                        tokens.push(new Token(Token.types.number, buffer));
                    }
                    // check if we hit accessor to an answer
                    else if ( buffer[0] == '.' ) 
                    {
                        tokens.push(new Token(Token.types.special.accessor, buffer));
                    } 
                    // we ended a text section
                    else 
                    {
                        tokens.push(new Token(Token.types.text, buffer));
                    }
                    
                    STATE = START;
                    break;
                }

                buffer += character;
                break;
            }
        }
    }

    return tokens;
}