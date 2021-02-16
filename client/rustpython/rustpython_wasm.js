import { PyError } from './snippets/rustpython_wasm-e392e8a2c62f1213/inline0.js';
import { has_prop, get_prop, set_prop, type_of, instance_of } from './snippets/rustpython_wasm-e392e8a2c62f1213/inline1.js';
import * as wasm from './rustpython_wasm_bg.wasm';

const heap = new Array(32);

heap.fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachegetFloat64Memory0 = null;
function getFloat64Memory0() {
    if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachegetFloat64Memory0;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}
function __wbg_adapter_36(arg0, arg1, arg2, arg3) {
    var ret = wasm._dyn_core__ops__function__FnMut__A__B___Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h8dfed3256f06e8c0(arg0, arg1, isLikeNone(arg2) ? 0 : addHeapObject(arg2), isLikeNone(arg3) ? 0 : addHeapObject(arg3));
    return takeObject(ret);
}

function __wbg_adapter_39(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h4432adc2b6117ca3(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_42(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__Fn__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__he002566595622b45(arg0, arg1, arg2);
}

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
    if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory0;
}

function getArrayJsValueFromWasm0(ptr, len) {
    const mem = getUint32Memory0();
    const slice = mem.subarray(ptr / 4, ptr / 4 + len);
    const result = [];
    for (let i = 0; i < slice.length; i++) {
        result.push(takeObject(slice[i]));
    }
    return result;
}
/**
*/
export function setup_console_error() {
    wasm.setup_console_error();
}

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
export function pyEval(source, options) {
    var ptr0 = passStringToWasm0(source, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.pyEval(ptr0, len0, isLikeNone(options) ? 0 : addHeapObject(options));
    return takeObject(ret);
}

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
export function pyExec(source, options) {
    var ptr0 = passStringToWasm0(source, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    wasm.pyExec(ptr0, len0, isLikeNone(options) ? 0 : addHeapObject(options));
}

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
export function pyExecSingle(source, options) {
    var ptr0 = passStringToWasm0(source, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ret = wasm.pyExecSingle(ptr0, len0, isLikeNone(options) ? 0 : addHeapObject(options));
    return takeObject(ret);
}

function handleError(e) {
    wasm.__wbindgen_exn_store(addHeapObject(e));
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}
function __wbg_adapter_186(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__h002822fcca821332(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

/**
*/
export class VirtualMachine {

    static __wrap(ptr) {
        const obj = Object.create(VirtualMachine.prototype);
        obj.ptr = ptr;

        return obj;
    }

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_virtualmachine_free(ptr);
    }
    /**
    * @returns {boolean}
    */
    valid() {
        var ret = wasm.virtualmachine_valid(this.ptr);
        return ret !== 0;
    }
    /**
    */
    assert_valid() {
        wasm.virtualmachine_assert_valid(this.ptr);
    }
    /**
    */
    destroy() {
        wasm.virtualmachine_destroy(this.ptr);
    }
    /**
    * @param {string} name
    * @param {any} value
    */
    addToScope(name, value) {
        var ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.virtualmachine_addToScope(this.ptr, ptr0, len0, addHeapObject(value));
    }
    /**
    * @param {any} stdout
    */
    setStdout(stdout) {
        wasm.virtualmachine_setStdout(this.ptr, addHeapObject(stdout));
    }
    /**
    * @param {string} name
    * @param {any} module
    */
    injectModule(name, module) {
        var ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.virtualmachine_injectModule(this.ptr, ptr0, len0, addHeapObject(module));
    }
    /**
    * @param {string} source
    * @param {string | undefined} source_path
    * @returns {any}
    */
    exec(source, source_path) {
        var ptr0 = passStringToWasm0(source, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(source_path) ? 0 : passStringToWasm0(source_path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.virtualmachine_exec(this.ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {string} source
    * @param {string | undefined} source_path
    * @returns {any}
    */
    eval(source, source_path) {
        var ptr0 = passStringToWasm0(source, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(source_path) ? 0 : passStringToWasm0(source_path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.virtualmachine_eval(this.ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
    /**
    * @param {string} source
    * @param {string | undefined} source_path
    * @returns {any}
    */
    execSingle(source, source_path) {
        var ptr0 = passStringToWasm0(source, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(source_path) ? 0 : passStringToWasm0(source_path, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.virtualmachine_execSingle(this.ptr, ptr0, len0, ptr1, len1);
        return takeObject(ret);
    }
}
/**
*/
export class vmStore {

    free() {
        const ptr = this.ptr;
        this.ptr = 0;

        wasm.__wbg_vmstore_free(ptr);
    }
    /**
    * @param {string} id
    * @param {boolean | undefined} inject_browser_module
    * @returns {VirtualMachine}
    */
    static init(id, inject_browser_module) {
        var ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.vmstore_init(ptr0, len0, isLikeNone(inject_browser_module) ? 0xFFFFFF : inject_browser_module ? 1 : 0);
        return VirtualMachine.__wrap(ret);
    }
    /**
    * @param {string} id
    * @returns {any}
    */
    static get(id) {
        var ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.vmstore_get(ptr0, len0);
        return takeObject(ret);
    }
    /**
    * @param {string} id
    */
    static destroy(id) {
        var ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.vmstore_destroy(ptr0, len0);
    }
    /**
    * @returns {any[]}
    */
    static ids() {
        wasm.vmstore_ids(8);
        var r0 = getInt32Memory0()[8 / 4 + 0];
        var r1 = getInt32Memory0()[8 / 4 + 1];
        var v0 = getArrayJsValueFromWasm0(r0, r1).slice();
        wasm.__wbindgen_free(r0, r1 * 4);
        return v0;
    }
}

export const __wbindgen_is_object = function(arg0) {
    const val = getObject(arg0);
    var ret = typeof(val) === 'object' && val !== null;
    return ret;
};

export const __wbg_typeof_c7ffeb3cb992b1ac = function(arg0, arg1) {
    var ret = type_of(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbindgen_number_new = function(arg0) {
    var ret = arg0;
    return addHeapObject(ret);
};

export const __wbindgen_string_new = function(arg0, arg1) {
    var ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
};

export const __wbindgen_object_drop_ref = function(arg0) {
    takeObject(arg0);
};

export const __wbindgen_cb_drop = function(arg0) {
    const obj = takeObject(arg0).original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    var ret = false;
    return ret;
};

export const __wbg_new_5e72f7d76e370bd6 = function(arg0) {
    var ret = new PyError(takeObject(arg0));
    return addHeapObject(ret);
};

export const __wbindgen_object_clone_ref = function(arg0) {
    var ret = getObject(arg0);
    return addHeapObject(ret);
};

export const __wbindgen_cb_forget = function(arg0) {
    takeObject(arg0);
};

export const __wbindgen_is_function = function(arg0) {
    var ret = typeof(getObject(arg0)) === 'function';
    return ret;
};

export const __wbindgen_is_undefined = function(arg0) {
    var ret = getObject(arg0) === undefined;
    return ret;
};

export const __wbg_virtualmachine_new = function(arg0) {
    var ret = VirtualMachine.__wrap(arg0);
    return addHeapObject(ret);
};

export const __wbindgen_is_null = function(arg0) {
    var ret = getObject(arg0) === null;
    return ret;
};

export const __wbg_hasprop_a870d721b91e925e = function(arg0, arg1) {
    try {
        var ret = has_prop(getObject(arg0), getObject(arg1));
        return ret;
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_getprop_ef152f26344fdb20 = function(arg0, arg1) {
    try {
        var ret = get_prop(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_instanceof_c879361b6e3350e1 = function(arg0, arg1) {
    try {
        var ret = instance_of(getObject(arg0), getObject(arg1));
        return ret;
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_setprop_36352fb0d7511173 = function(arg0, arg1, arg2) {
    try {
        set_prop(getObject(arg0), getObject(arg1), getObject(arg2));
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_new_68adb0d58759a4ed = function() {
    var ret = new Object();
    return addHeapObject(ret);
};

export const __wbg_set_2e79e744454afade = function(arg0, arg1, arg2) {
    getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
};

export const __widl_f_log_ = function(arg0) {
    console.log(...getObject(arg0));
};

export const __widl_instanceof_Window = function(arg0) {
    var ret = getObject(arg0) instanceof Window;
    return ret;
};

export const __widl_f_query_selector_Document = function(arg0, arg1, arg2) {
    try {
        var ret = getObject(arg0).querySelector(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __widl_f_get_attribute_Element = function(arg0, arg1, arg2, arg3) {
    var ret = getObject(arg1).getAttribute(getStringFromWasm0(arg2, arg3));
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __widl_f_set_attribute_Element = function(arg0, arg1, arg2, arg3, arg4) {
    try {
        getObject(arg0).setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    } catch (e) {
        handleError(e)
    }
};

export const __widl_f_set_Headers = function(arg0, arg1, arg2, arg3, arg4) {
    try {
        getObject(arg0).set(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    } catch (e) {
        handleError(e)
    }
};

export const __widl_f_new_with_str_and_init_Request = function(arg0, arg1, arg2) {
    try {
        var ret = new Request(getStringFromWasm0(arg0, arg1), getObject(arg2));
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __widl_f_headers_Request = function(arg0) {
    var ret = getObject(arg0).headers;
    return addHeapObject(ret);
};

export const __widl_instanceof_Response = function(arg0) {
    var ret = getObject(arg0) instanceof Response;
    return ret;
};

export const __widl_f_array_buffer_Response = function(arg0) {
    try {
        var ret = getObject(arg0).arrayBuffer();
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __widl_f_json_Response = function(arg0) {
    try {
        var ret = getObject(arg0).json();
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __widl_f_text_Response = function(arg0) {
    try {
        var ret = getObject(arg0).text();
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __widl_f_cancel_animation_frame_Window = function(arg0, arg1) {
    try {
        getObject(arg0).cancelAnimationFrame(arg1);
    } catch (e) {
        handleError(e)
    }
};

export const __widl_f_request_animation_frame_Window = function(arg0, arg1) {
    try {
        var ret = getObject(arg0).requestAnimationFrame(getObject(arg1));
        return ret;
    } catch (e) {
        handleError(e)
    }
};

export const __widl_f_document_Window = function(arg0) {
    var ret = getObject(arg0).document;
    return isLikeNone(ret) ? 0 : addHeapObject(ret);
};

export const __widl_f_fetch_with_request_Window = function(arg0, arg1) {
    var ret = getObject(arg0).fetch(getObject(arg1));
    return addHeapObject(ret);
};

export const __wbg_now_5ca176d145ee3c4d = function() {
    var ret = Date.now();
    return ret;
};

export const __wbg_randomFillSync_d5bd2d655fdf256a = function(arg0, arg1, arg2) {
    getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
};

export const __wbg_getRandomValues_f5e14ab7ac8e995d = function(arg0, arg1, arg2) {
    getObject(arg0).getRandomValues(getArrayU8FromWasm0(arg1, arg2));
};

export const __wbg_self_1b7a39e3a92c949c = function() {
    try {
        var ret = self.self;
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_require_604837428532a733 = function(arg0, arg1) {
    var ret = require(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export const __wbg_crypto_968f1772287e2df0 = function(arg0) {
    var ret = getObject(arg0).crypto;
    return addHeapObject(ret);
};

export const __wbg_getRandomValues_a3d34b4fee3c2869 = function(arg0) {
    var ret = getObject(arg0).getRandomValues;
    return addHeapObject(ret);
};

export const __wbg_next_070429384a9059a5 = function(arg0) {
    try {
        var ret = getObject(arg0).next();
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_done_24ef91fda5bda381 = function(arg0) {
    var ret = getObject(arg0).done;
    return ret;
};

export const __wbg_value_1b88544311a72cbf = function(arg0) {
    var ret = getObject(arg0).value;
    return addHeapObject(ret);
};

export const __wbg_get_b086a3091905ea8f = function(arg0, arg1) {
    try {
        var ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_call_12b949cfc461d154 = function(arg0, arg1) {
    try {
        var ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_new_3c32f9cd3d7f4595 = function() {
    var ret = new Array();
    return addHeapObject(ret);
};

export const __wbg_isArray_622859a7a45417d2 = function(arg0) {
    var ret = Array.isArray(getObject(arg0));
    return ret;
};

export const __wbg_push_446cc0334a2426e8 = function(arg0, arg1) {
    var ret = getObject(arg0).push(getObject(arg1));
    return ret;
};

export const __wbg_instanceof_ArrayBuffer_851580e80d9022de = function(arg0) {
    var ret = getObject(arg0) instanceof ArrayBuffer;
    return ret;
};

export const __wbg_isView_ab63aa832c5250cd = function(arg0) {
    var ret = ArrayBuffer.isView(getObject(arg0));
    return ret;
};

export const __wbg_values_1275be8493e79677 = function(arg0) {
    var ret = getObject(arg0).values();
    return addHeapObject(ret);
};

export const __wbg_instanceof_Error_e78601fa30e62f10 = function(arg0) {
    var ret = getObject(arg0) instanceof Error;
    return ret;
};

export const __wbg_new_d930e9e72c80e0f9 = function(arg0, arg1) {
    var ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export const __wbg_message_455acafd27004bda = function(arg0) {
    var ret = getObject(arg0).message;
    return addHeapObject(ret);
};

export const __wbg_name_969a3948c43faf07 = function(arg0) {
    var ret = getObject(arg0).name;
    return addHeapObject(ret);
};

export const __wbg_toString_4854d781174a9aa9 = function(arg0) {
    var ret = getObject(arg0).toString();
    return addHeapObject(ret);
};

export const __wbg_newnoargs_c4b2cbbd30e2d057 = function(arg0, arg1) {
    var ret = new Function(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export const __wbg_apply_44701e75f0e776c5 = function(arg0, arg1, arg2) {
    try {
        var ret = getObject(arg0).apply(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_call_ce7cf17fc6380443 = function(arg0, arg1, arg2) {
    try {
        var ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_new_0473130a23fff03d = function() {
    var ret = new Map();
    return addHeapObject(ret);
};

export const __wbg_set_72b4899cab9b0020 = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

export const __wbg_getTime_cf70180ac23e225e = function(arg0) {
    var ret = getObject(arg0).getTime();
    return ret;
};

export const __wbg_getTimezoneOffset_87bb91154ad340ba = function(arg0) {
    var ret = getObject(arg0).getTimezoneOffset();
    return ret;
};

export const __wbg_new0_ec4525550bb7b3c8 = function() {
    var ret = new Date();
    return addHeapObject(ret);
};

export const __wbg_instanceof_Object_d35fc70d59ddc182 = function(arg0) {
    var ret = getObject(arg0) instanceof Object;
    return ret;
};

export const __wbg_create_e59c368e67e9c5c2 = function(arg0) {
    var ret = Object.create(getObject(arg0));
    return addHeapObject(ret);
};

export const __wbg_entries_3e5e2cb8ac2c0fdd = function(arg0) {
    var ret = Object.entries(getObject(arg0));
    return addHeapObject(ret);
};

export const __wbg_new_7dd9b384a913884d = function() {
    var ret = new Object();
    return addHeapObject(ret);
};

export const __wbg_toString_7561c9420cf3948f = function(arg0) {
    var ret = getObject(arg0).toString();
    return addHeapObject(ret);
};

export const __wbg_new_887a5b0724fc9c31 = function(arg0, arg1) {
    var ret = new SyntaxError(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export const __wbg_new_b4162db8edcd470a = function(arg0, arg1) {
    var ret = new TypeError(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export const __wbg_instanceof_Promise_9f348763f6bce374 = function(arg0) {
    var ret = getObject(arg0) instanceof Promise;
    return ret;
};

export const __wbg_new_d3eff62d5c013634 = function(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_186(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        var ret = new Promise(cb0);
        return addHeapObject(ret);
    } finally {
        state0.a = state0.b = 0;
    }
};

export const __wbg_resolve_6885947099a907d3 = function(arg0) {
    var ret = Promise.resolve(getObject(arg0));
    return addHeapObject(ret);
};

export const __wbg_then_b6fef331fde5cf0a = function(arg0, arg1) {
    var ret = getObject(arg0).then(getObject(arg1));
    return addHeapObject(ret);
};

export const __wbg_then_7d828a330efec051 = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
};

export const __wbg_globalThis_22e06d4bea0084e3 = function() {
    try {
        var ret = globalThis.globalThis;
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_self_00b0599bca667294 = function() {
    try {
        var ret = self.self;
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_window_aa795c5aad79b8ac = function() {
    try {
        var ret = window.window;
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_global_cc239dc2303f417c = function() {
    try {
        var ret = global.global;
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_buffer_1bb127df6348017b = function(arg0) {
    var ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

export const __wbg_newwithbyteoffsetandlength_6b93e5ed7d4086de = function(arg0, arg1, arg2) {
    var ret = new Uint8Array(getObject(arg0), arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export const __wbg_length_95b24a2f871acd5e = function(arg0) {
    var ret = getObject(arg0).length;
    return ret;
};

export const __wbg_new_dca22b33e64c73c1 = function(arg0) {
    var ret = new Uint8Array(getObject(arg0));
    return addHeapObject(ret);
};

export const __wbg_set_73d74d5ab6493dfb = function(arg0, arg1, arg2) {
    getObject(arg0).set(getObject(arg1), arg2 >>> 0);
};

export const __wbg_instanceof_Uint8Array_c55c5b2c5098c51e = function(arg0) {
    var ret = getObject(arg0) instanceof Uint8Array;
    return ret;
};

export const __wbg_buffer_100cc64e9fe46f5f = function(arg0) {
    var ret = getObject(arg0).buffer;
    return addHeapObject(ret);
};

export const __wbg_slice_09efef049e78a67d = function(arg0, arg1, arg2) {
    var ret = getObject(arg0).slice(arg1 >>> 0, arg2 >>> 0);
    return addHeapObject(ret);
};

export const __wbg_byteLength_34e6d8105631f322 = function(arg0) {
    var ret = getObject(arg0).byteLength;
    return ret;
};

export const __wbg_new_5bd96153f4fca57d = function(arg0, arg1) {
    var ret = new WebAssembly.RuntimeError(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
};

export const __wbg_apply_5c2b47af834282d7 = function(arg0, arg1, arg2) {
    try {
        var ret = Reflect.apply(getObject(arg0), getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_construct_014d4551d62358be = function(arg0, arg1) {
    try {
        var ret = Reflect.construct(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_construct_70988c390bdacb20 = function(arg0, arg1, arg2) {
    try {
        var ret = Reflect.construct(getObject(arg0), getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    } catch (e) {
        handleError(e)
    }
};

export const __wbg_set_8d5fd23e838df6b0 = function(arg0, arg1, arg2) {
    try {
        var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        return ret;
    } catch (e) {
        handleError(e)
    }
};

export const __wbindgen_number_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = typeof(obj) === 'number' ? obj : undefined;
    getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
    getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
};

export const __wbindgen_string_get = function(arg0, arg1) {
    const obj = getObject(arg1);
    var ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbindgen_boolean_get = function(arg0) {
    const v = getObject(arg0);
    var ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
    return ret;
};

export const __wbindgen_debug_string = function(arg0, arg1) {
    var ret = debugString(getObject(arg1));
    var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
};

export const __wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export const __wbindgen_rethrow = function(arg0) {
    throw takeObject(arg0);
};

export const __wbindgen_memory = function() {
    var ret = wasm.memory;
    return addHeapObject(ret);
};

export const __wbindgen_closure_wrapper429 = function(arg0, arg1, arg2) {

    const state = { a: arg0, b: arg1, cnt: 1 };
    const real = (arg0) => {
        state.cnt++;
        try {
            return __wbg_adapter_42(state.a, state.b, arg0);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(159)(state.a, state.b);
                state.a = 0;
            }
        }
    }
    ;
    real.original = state;
    var ret = real;
    return addHeapObject(ret);
};

export const __wbindgen_closure_wrapper693 = function(arg0, arg1, arg2) {

    const state = { a: arg0, b: arg1, cnt: 1 };
    const real = (arg0) => {
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return __wbg_adapter_39(a, state.b, arg0);
        } finally {
            if (--state.cnt === 0) wasm.__wbindgen_export_2.get(220)(a, state.b);
            else state.a = a;
        }
    }
    ;
    real.original = state;
    var ret = real;
    return addHeapObject(ret);
};

export const __wbindgen_closure_wrapper427 = function(arg0, arg1, arg2) {

    const state = { a: arg0, b: arg1, cnt: 1 };
    const real = (arg0, arg1) => {
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return __wbg_adapter_36(a, state.b, arg0, arg1);
        } finally {
            if (--state.cnt === 0) wasm.__wbindgen_export_2.get(159)(a, state.b);
            else state.a = a;
        }
    }
    ;
    real.original = state;
    var ret = real;
    return addHeapObject(ret);
};

wasm.__wbindgen_start();

