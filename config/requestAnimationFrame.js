global.requestAnimationFrame = function (cb) {
    cb.call(cb, Array.prototype.slice.call(arguments));
};
