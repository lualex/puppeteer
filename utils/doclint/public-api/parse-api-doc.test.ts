import {parseApiDoc} from './parse-api-doc';
import {describe,it} from 'mocha';
import * as fs from 'fs';
import * as path from 'path';
import * as expect from 'expect';

describe('parseApiDoc', () => {
  it('parses a class and its methods', () => {
    const input = `### class: Worker

The Worker class represents a [WebWorker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API).

#### worker.evaluate(pageFunction[, ...args])
- \`pageFunction\` <[function]|[string]> Function to be evaluated in the worker context
- returns: <[Promise]<[boolean]>>  returns \`true\` if the revision could be downloaded from the host.
`;

    const classesAndMethods = parseApiDoc(input);
    expect(classesAndMethods).toEqual(new Map([
      ['Worker', new Map([
        ['worker.evaluate(pageFunction[, ...args])', {
          arguments: new Set([
            { name: 'pageFunction', type: '<[function]|[string]>', text: 'Function to be evaluated in the worker context'}
          ]),
          returnType: '<[Promise]<[boolean]>>',
        }]
      ])]
    ]));
  });

  it('parses multiple methods in a class', () => {
    const input = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'multiple-methods.md'), { encoding: 'utf8'});

    const classesAndMethods = parseApiDoc(input);
    expect(classesAndMethods).toEqual(new Map([
      ['Worker', new Map([
        ['worker.evaluate(pageFunction[, ...args])', {
          arguments: new Set([
            { name: 'pageFunction', type: '<[function]|[string]>', text: 'Function to be evaluated in the worker context'}
          ]),
          returnType: '<[Promise]<[boolean]>>',
        }],
        ['worker.otherMethod()', {
          arguments: new Set(),
          returnType: '<[Promise]<[boolean]>>',
        }],
        ['worker.somethingElse(x)', {
          arguments: new Set([
            { name: 'x', type: '<[string]>', text: 'something'}
          ]),
          returnType: '<[Promise]<[string]>>',
        }],
      ])]
    ]));
  });

  it('can parse multiple classes', () => {
    const input = fs.readFileSync(path.join(__dirname, '..', 'fixtures', 'multiple-classes.md'), { encoding: 'utf8'});

    const classesAndMethods = parseApiDoc(input);
    expect(classesAndMethods).toEqual(new Map([
      ['Worker', new Map([
        ['worker.evaluate(pageFunction[, ...args])', {
          arguments: new Set([
            { name: 'pageFunction', type: '<[function]|[string]>', text: 'Function to be evaluated in the worker context'}
          ]),
          returnType: '<[Promise]<[boolean]>>',
        }],
      ])],
      ['Page', new Map([
        ['page.log(x, y, z)', {
          arguments: new Set([
            { name: 'x', type: '<[string]>', text: 'something'},
            { name: 'y', type: '<[string]>', text: 'something'},
            { name: 'z', type: '<[string]>', text: 'something'}
          ]),
          returnType: '<[Promise]<[string]>>',
        }],
      ])]
    ]));
  });
});
