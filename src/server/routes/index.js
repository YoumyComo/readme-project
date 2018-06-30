"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
require("./Book");
require("./Word");
require("./QRCode");
require("./Image");
require("./Audio");
require("./Favicon");
require("./Monitor");
require("./Entry");
require("./InitState");
require("./Signin");
const decorator_1 = require("./decorator");
const router = new Router();
decorator_1.setRouter(router);
exports.default = router.routes();
//# sourceMappingURL=index.js.map