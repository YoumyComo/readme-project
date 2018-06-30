"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorator_1 = require("./decorator");
class MonitorController {
    alive() {
        return {
            data: true,
        };
    }
    somemethod() {
        return 'haha';
    }
}
tslib_1.__decorate([
    decorator_1.route('get', '/api/monitor/alive')
], MonitorController.prototype, "alive", null);
tslib_1.__decorate([
    decorator_1.route('get', '/api/somemethod')
], MonitorController.prototype, "somemethod", null);
exports.default = MonitorController;
//# sourceMappingURL=Monitor.js.map