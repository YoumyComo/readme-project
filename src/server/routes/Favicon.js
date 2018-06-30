"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorator_1 = require("./decorator");
class Favicon {
    ico(ctx) {
        ctx.status = 204;
    }
}
tslib_1.__decorate([
    decorator_1.route('get', '/*/favicon.ico')
], Favicon.prototype, "ico", null);
exports.default = Favicon;
//# sourceMappingURL=Favicon.js.map