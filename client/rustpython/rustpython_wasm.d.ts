/* tslint:disable */
/* eslint-disable */
/**
*/
export function setup_console_error(): void;
/**
* Evaluate Python code
*
* ```js
* var result = pyEval(code, options?);
* ```
*
* `code`: `string`: The Python code to run in eval mode
*
* `options`:
*
* -   `vars?`: `{ [key: string]: any }`: Variables passed to the VM that can be
*     accessed in Python with the variable `js_vars`. Functions do work, and
*     receive the Python kwargs as the `this` argument.
* -   `stdout?`: `\"console\" | ((out: string) => void) | null`: A function to replace the
*     native print native print function, and it will be `console.log` when giving
*     `undefined` or \"console\", and it will be a dumb function when giving null.
* @param {string} source 
* @param {any | undefined} options 
* @returns {any} 
*/
export function pyEval(source: string, options?: any): any;
/**
* Evaluate Python code
*
* ```js
* pyExec(code, options?);
* ```
*
* `code`: `string`: The Python code to run in exec mode
*
* `options`: The options are the same as eval mode
* @param {string} source 
* @param {any | undefined} options 
*/
export function pyExec(source: string, options?: any): void;
/**
* Evaluate Python code
*
* ```js
* var result = pyExecSingle(code, options?);
* ```
*
* `code`: `string`: The Python code to run in exec single mode
*
* `options`: The options are the same as eval mode
* @param {string} source 
* @param {any | undefined} options 
* @returns {any} 
*/
export function pyExecSingle(source: string, options?: any): any;
/**
*/
export class VirtualMachine {
  free(): void;
/**
* @returns {boolean} 
*/
  valid(): boolean;
/**
*/
  assert_valid(): void;
/**
*/
  destroy(): void;
/**
* @param {string} name 
* @param {any} value 
*/
  addToScope(name: string, value: any): void;
/**
* @param {any} stdout 
*/
  setStdout(stdout: any): void;
/**
* @param {string} name 
* @param {any} module 
*/
  injectModule(name: string, module: any): void;
/**
* @param {string} source 
* @param {string | undefined} source_path 
* @returns {any} 
*/
  exec(source: string, source_path?: string): any;
/**
* @param {string} source 
* @param {string | undefined} source_path 
* @returns {any} 
*/
  eval(source: string, source_path?: string): any;
/**
* @param {string} source 
* @param {string | undefined} source_path 
* @returns {any} 
*/
  execSingle(source: string, source_path?: string): any;
}
/**
*/
export class vmStore {
  free(): void;
/**
* @param {string} id 
* @param {boolean | undefined} inject_browser_module 
* @returns {VirtualMachine} 
*/
  static init(id: string, inject_browser_module?: boolean): VirtualMachine;
/**
* @param {string} id 
* @returns {any} 
*/
  static get(id: string): any;
/**
* @param {string} id 
*/
  static destroy(id: string): void;
/**
* @returns {any[]} 
*/
  static ids(): any[];
}
