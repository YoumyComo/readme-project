"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@src/utils/types");
const config = require("config");
const SERVER_HANDLE_SUCCESS_CODE = 2000;
class ServerError extends Error {
    constructor(options) {
        types_1.isString(options) ? super(options) : super(options.message);
        this.ignore = false;
        this.show = true;
        this.code = 500;
        this.status = 500;
        if (!types_1.isString(options)) {
            this.setOptions(options);
        }
    }
    setOptions(options) {
        if (types_1.isBoolean(options.ignore)) {
            this.ignore = options.ignore;
        }
        if (types_1.isBoolean(options.show)) {
            this.show = options.show;
        }
        if (types_1.isNumber(options.code)) {
            this.code = options.code;
        }
        if (types_1.isNumber(options.status)) {
            this.status = options.status;
        }
        if (options.data) {
            this.data = options.data;
        }
    }
}
exports.default = ServerError;
exports.assertThriftSuccess = (response, method, args) => {
    const status = response.status;
    if (config.get('isMock'))
        return;
    if (!status || !status.code)
        return;
    if (status.code === SERVER_HANDLE_SUCCESS_CODE) {
        return;
    }
    else {
        throw new ServerError({
            message: status.msg,
            code: status.code,
            data: {
                method,
                args,
            },
        });
    }
};
//# sourceMappingURL=error.js.map