"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const pathToRegexp = require("path-to-regexp");
const targetRoutesMap = new Map();
const instanceCache = new Map();
const routes = [];
function route(method, url) {
    return (target, name) => {
        let instance = instanceCache.get(target);
        if (!instance) {
            instance = new target.constructor();
            instanceCache.set(target, instance);
        }
        if (!Array.isArray(url)) {
            url = [url];
        }
        url.forEach(u => {
            const urlKeys = [];
            const routeItem = {
                method,
                url: u,
                fn: (ctx, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const result = yield instance[name].call(instance, ctx, next);
                    ctx.body = ctx.body || result;
                }),
                regexp: pathToRegexp(u, urlKeys),
                name,
                urlKeys,
            };
            let targetRoutes = targetRoutesMap.get(target.constructor);
            if (!targetRoutes) {
                targetRoutes = [];
            }
            targetRoutes.push(routeItem);
            targetRoutesMap.set(target.constructor, targetRoutes);
            routes.push(routeItem);
        });
    };
}
exports.route = route;
function setRouter(router) {
    routes.forEach(r => {
        router[r.method](r.url, r.fn);
    });
}
exports.setRouter = setRouter;
function match(controller, path) {
    const targetRoutes = targetRoutesMap.get(controller.constructor);
    const params = {};
    if (!targetRoutes)
        return null;
    const router = targetRoutes.find(r => {
        const execArray = r.regexp.exec(path);
        if (!execArray)
            return false;
        r.urlKeys.forEach((k, i) => {
            params[k.name] = execArray[i + 1];
        });
        return true;
    });
    if (!router)
        return null;
    return {
        fn: controller[router.name],
        params,
    };
}
exports.match = match;
//# sourceMappingURL=decorator.js.map