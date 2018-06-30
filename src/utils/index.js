"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
exports.bindMethod = (t, keys) => {
    keys.forEach(k => {
        const value = t[k];
        if (typeof value === 'function') {
            t[k] = value.bind(t);
        }
    });
    return t;
};
exports.block = (target, key, descriptor) => {
    target;
    key;
    const fn = descriptor.value;
    if (!types_1.isFunction(fn))
        return descriptor;
    let promise;
    descriptor.value = function (...args) {
        let lastPromise = promise;
        const next = () => {
            const result = fn.apply(this, args);
            if (result && types_1.isFunction(result.then)) {
                promise = result;
            }
            else {
                promise = null;
            }
            return result;
        };
        if (lastPromise) {
            return lastPromise
                .then(next, next);
        }
        else {
            next();
        }
    };
    return descriptor;
};
exports.throttle = (timeout) => (target, key, descriptor) => {
    const fn = target[key];
    let handlerTimer;
    if (!types_1.isFunction(fn))
        return descriptor;
    descriptor.value = function (...args) {
        let handler = handlerTimer;
        if (handler)
            clearTimeout(handler);
        const newHandler = setTimeout(() => {
            fn.apply(this, args);
        }, timeout);
        handlerTimer = newHandler;
    };
    return descriptor;
};
//# sourceMappingURL=index.js.map