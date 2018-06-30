"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorator_1 = require("./decorator");
const Config = require("config");
const util_1 = require("util");
const fs = require("fs");
const Path = require("path");
const readFile = util_1.promisify(fs.readFile);
function readJSON(file) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const buffer = yield readFile(file);
        return JSON.parse(buffer.toString());
    });
}
class QRCodeController {
    get(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { id } = ctx.params;
            const filepath = Path.join(Config.get('datadir'), 'qrcodes', `${id}.json`);
            const data = yield readJSON(filepath);
            const charpterfile = Path.join(Config.get('datadir'), 'books', data.book, `${data.charpter}.json`);
            ctx.set('Content-Type', 'Application/json');
            const charpter = yield readJSON(charpterfile);
            charpter.words = yield Promise.all(charpter.words.map((word) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const wordfile = Path.join(Config.get('datadir'), 'words', `${word}.json`);
                const wordInfo = yield readJSON(wordfile);
                return {
                    spell: wordInfo.spell,
                    translation: wordInfo.translation,
                };
            })));
            ctx.body = charpter;
        });
    }
}
tslib_1.__decorate([
    decorator_1.route('get', '/api/qrcode/:id')
], QRCodeController.prototype, "get", null);
exports.default = QRCodeController;
//# sourceMappingURL=QRCode.js.map