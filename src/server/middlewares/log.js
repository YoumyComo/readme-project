"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config = require("config");
exports.isDev = config.get('isDev');
exports.default = (ctx, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    if (exports.isDev)
        return next();
    const start = new Date();
    yield next();
    const end = new Date();
    const spend = end.getDate() - start.getDate();
    const log = ctx.status >= 400 ? console.error : console.log;
    log(ctx.status, ctx.method, ctx.path, ctx.querystring, 'SPEND:', spend);
    const { body } = ctx.request;
    if (body && Object.keys(body).length) {
        log('REQ BODY', body);
    }
    if (ctx.body && typeof ctx.body !== 'string') {
        log('RES BODY', ctx.body);
    }
});
//# sourceMappingURL=log.js.map