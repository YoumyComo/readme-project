"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let count = 0;
let inited = false;
let cb = null;
function ref() {
    inited = true;
    count++;
}
exports.ref = ref;
function unref() {
    count--;
    if (cb) {
        cb();
    }
}
exports.unref = unref;
function setCb(_cb) {
    cb = _cb;
    if (inited && count === 0 && cb) {
        cb();
    }
}
exports.setCb = setCb;
//# sourceMappingURL=loader.js.map