"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config = require("config");
const requireExtensions_1 = require("@server/lib/requireExtensions");
const error_1 = require("@server/lib/error");
const decorator_1 = require("./decorator");
const InitState_1 = require("./InitState");
exports.isDev = config.get('isDev');
class EntryController {
    constructor() {
        this.initState = new InitState_1.default();
    }
    scriptsTag(scripts) {
        const scriptTag = (s) => {
            if (s.match(/css$/)) {
                return `<link href="${s}" rel="stylesheet" type="text/css">`;
            }
            else {
                return `<script crossorigin src="${s}" type="text/javascript"></script>`;
            }
        };
        if (Array.isArray(scripts)) {
            return scripts.map(s => scriptTag(s)).join('');
        }
        return scriptTag(scripts);
    }
    index(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!ctx.accepts('html')) {
                throw new error_1.default({
                    ignore: true,
                    status: 406,
                    message: 'Not Acceptable',
                });
            }
            const mainFile = requireExtensions_1.chunkResolver('app') || requireExtensions_1.fileResolver('/static/app.js');
            const initState = (yield this.initState.getState(ctx)) || null;
            let chunks = [];
            let appStr = '';
            const browserConfig = {};
            return `<html>
      <head>
        <title></title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <script>var config = ${JSON.stringify(browserConfig)}</script>
        <script>var initState = ${JSON.stringify({
                [ctx.path]: initState,
            })}</script>
        ${this.scriptsTag(mainFile)}
        ${chunks.map(c => {
                const f = requireExtensions_1.chunkResolver(c);
                if (!f)
                    return null;
                return this.scriptsTag(f);
            }).filter(Boolean).join('')}
      </head>
      <body>
        <div id="app">${appStr}</div>
      </body>
    </html>`;
        });
    }
}
tslib_1.__decorate([
    decorator_1.route('get', '*')
], EntryController.prototype, "index", null);
exports.default = EntryController;
//# sourceMappingURL=Entry.js.map