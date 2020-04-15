import * as path from 'path';
import * as fs from 'fs';
import * as marked from 'marked';
import { start } from 'repl';

export const parseApiDoc = (sourceCode: string) => {

  const tokens = marked.lexer(sourceCode);

  const classesAndMethods = consumeTokens(tokens);

  return classesAndMethods;
};


interface Argument {
  name: string;
  type: string;
  text: string;
}

type Method = {
  arguments: Set<Argument>,
  returnType: string,
}

const consumeTokens = (tokens: marked.TokensList) => {
  const classesAndMethods = new Map<string, Map<string, Method>>();

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'heading' && token.text.startsWith('class:')) {
      const className = token.text.replace('class: ', '');
      const {methodsAndArguments, indexToContinue} = consumeMethodsForClass(tokens, i + 1);
      classesAndMethods.set(className, methodsAndArguments);
      i = indexToContinue;
    }
  }

  return classesAndMethods;
};

const consumeMethodsForClass = (tokens: marked.TokensList, startIndex) => {
  const foundMethods = new Map<string, Method>();
  let i = startIndex;
  for (i; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'heading' && token.text.startsWith('class:')) break;

    if (token.type === 'heading' && token.depth === 4) {
      // this is the definition of a method
      const methodName = token.text;
      const {methodArguments, methodReturnType, indexToContinue} = consumeMethodArgumentsAndReturnType(tokens, i + 1);
      i = indexToContinue;
      foundMethods.set(methodName, { arguments: methodArguments, returnType: methodReturnType});
    }

  }

  /* We need the -1 here because we break on the header for the next class
   * so we need to step back i by 1 so the next line the consumer reads is that same
   * heading line.
   */
  return {methodsAndArguments: foundMethods, indexToContinue: i - 1};
};

const consumeMethodArgumentsAndReturnType = (tokens: marked.TokensList, startIndex) => {
  const foundArguments = new Set<Argument>();
  let returnType: string = '';

  let i = startIndex;
  for (i; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === 'text') {
      if (token.text.startsWith('returns: ')) {
        const [, returnTypeGroup] = /returns: <(.+)>/.exec(token.text);
        returnType = `<${returnTypeGroup}>`;
      } else {
        const argPartRegex = /`(\w+)`\s<(.+)> ([\w\s]+)/;
        const [, name, type, text] = argPartRegex.exec(token.text);
        foundArguments.add({
          name,
          text,
          type: `<${type}>`
        });

      }
    }

    if (token.type === 'list_end') break;
  }

  return {methodArguments: foundArguments, methodReturnType: returnType, indexToContinue: i};
};
