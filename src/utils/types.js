"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isDate(date) {
    if (!date)
        return false;
    return Object.prototype.toString.call(date) === '[object Date]';
}
exports.isDate = isDate;
function isDateNoGuards(date) {
    if (!date)
        return false;
    return Object.prototype.toString.call(date) === '[object Date]';
}
exports.isDateNoGuards = isDateNoGuards;
function isNumber(num) {
    return typeof num === 'number';
}
exports.isNumber = isNumber;
function isString(str) {
    return typeof str === 'string';
}
exports.isString = isString;
function isNull(nill) {
    return nill === null;
}
exports.isNull = isNull;
function isUndefined(u) {
    return typeof u === 'undefined';
}
exports.isUndefined = isUndefined;
function isBoolean(b) {
    return typeof b === 'boolean';
}
exports.isBoolean = isBoolean;
function isFunction(f) {
    return typeof f === 'function';
}
exports.isFunction = isFunction;
function isObject(o) {
    switch (true) {
        case Number.isNaN(o):
        case isString(o):
        case isNull(o):
        case isDate(o):
        case isUndefined(o):
        case isBoolean(o):
        case isFunction(o):
        case isNumber(o):
            return false;
        default:
            return true;
    }
}
exports.isObject = isObject;
function isPromise(p) {
    return p && isFunction(p.then);
}
exports.isPromise = isPromise;
//# sourceMappingURL=types.js.map