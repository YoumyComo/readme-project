"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorator_1 = require("./decorator");
const Config = require("config");
const util_1 = require("util");
const fs = require("fs");
const Path = require("path");
const readdir = util_1.promisify(fs.readdir);
const writeFile = util_1.promisify(fs.writeFile);
class WordController {
    list(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const filepath = Path.join(Config.get('datadir'), 'words');
            ctx.body = (yield readdir(filepath)).map(d => Path.basename(d, '.json'));
        });
    }
    add(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = ctx.request;
            let dataBody = data.body;
            console.log('Submit data:', dataBody);
            const { word } = dataBody;
            const wordFilePath = Path.join(Config.get('datadir'), 'words', `${word}.json`);
            yield writeFile(wordFilePath, JSON.stringify(dataBody));
        });
    }
    get(ctx) {
        const { spell } = ctx.params;
        ctx.set('Content-Type', 'Application/json');
        const filepath = Path.join(Config.get('datadir'), 'words', `${spell}.json`);
        ctx.body = fs.createReadStream(filepath);
    }
    edit(_) {
    }
    delete(_) {
    }
}
tslib_1.__decorate([
    decorator_1.route('get', '/api/words')
], WordController.prototype, "list", null);
tslib_1.__decorate([
    decorator_1.route('post', '/api/business/:bookName/:chapterName')
], WordController.prototype, "add", null);
tslib_1.__decorate([
    decorator_1.route('get', '/api/words/:spell')
], WordController.prototype, "get", null);
tslib_1.__decorate([
    decorator_1.route('put', '/api/words')
], WordController.prototype, "edit", null);
tslib_1.__decorate([
    decorator_1.route('delete', '/api/words/:id')
], WordController.prototype, "delete", null);
exports.default = WordController;
//# sourceMappingURL=Word.js.map