"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koaBody = require('koa-body');
const error_1 = require("./error");
const log_1 = require("./log");
const auth_1 = require("./auth");
exports.default = (app) => {
    app.use(auth_1.default);
    app.use(log_1.default);
    app.use(error_1.default);
    app.use(koaBody({
        multipart: true,
    }));
};
//# sourceMappingURL=index.js.map