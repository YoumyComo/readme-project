"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorator_1 = require("./decorator");
const prefix = '/state';
class PageStageController {
    getState(ctx) {
        const result = decorator_1.match(this, `${prefix}${ctx.path}`);
        if (result) {
            ctx.params = result.params;
            return result.fn.call(this, ctx);
        }
        return null;
    }
    index(ctx) {
        ctx;
        return {
            title: 'hello world',
        };
    }
    notFound() {
        return {};
    }
}
tslib_1.__decorate([
    decorator_1.route('get', `${prefix}/`)
], PageStageController.prototype, "index", null);
tslib_1.__decorate([
    decorator_1.route('get', `${prefix}/*`)
], PageStageController.prototype, "notFound", null);
exports.default = PageStageController;
//# sourceMappingURL=InitState.js.map