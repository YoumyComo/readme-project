"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
const MTA = require('@mtfe/mta-nodejs');
let mta;
if (config.get('isDev')) {
    mta = {
        timing() {
            return this;
        },
        increment() {
            return this;
        },
    };
}
else {
    mta = MTA({
        token: config.get('mta.nodejs.token'),
    });
}
exports.default = mta;
//# sourceMappingURL=mta.js.map