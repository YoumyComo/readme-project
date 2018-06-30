"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const routes_1 = require("./routes");
const middlewares_1 = require("./middlewares");
const app = new Koa();
exports.default = () => {
    app.use(require('koa-compress')());
    middlewares_1.default(app);
    app.use(routes_1.default);
    return app;
};
//# sourceMappingURL=app.js.map