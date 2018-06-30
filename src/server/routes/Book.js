"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorator_1 = require("./decorator");
const Config = require("config");
const util_1 = require("util");
const fs = require("fs");
const Path = require("path");
const readdir = util_1.promisify(fs.readdir);
const readFile = util_1.promisify(fs.readFile);
const mkdir = util_1.promisify(fs.mkdir);
const rmdir = util_1.promisify(fs.rmdir);
const writeFile = util_1.promisify(fs.writeFile);
const unlink = util_1.promisify(fs.unlink);
class WordController {
    list(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const bookDir = Path.join(Config.get('datadir'), 'books');
            const bufferBooksName = yield readdir(bookDir);
            const data = {};
            yield Promise.all(bufferBooksName.map((name) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const files = yield readdir(Path.join(bookDir, `${name}`));
                data[`${name}`] = files.map(file => Path.basename(file, '.json'));
            })));
            ctx.body = data;
        });
    }
    getChapter(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            debugger;
            const bookDir = Path.join(Config.get('datadir'), 'books', ctx.params.bookName);
            const allChapters = yield readdir(bookDir);
            ctx.body = allChapters.map(charpter => Path.basename(charpter, '.json'));
        });
    }
    getInfoByBookNameAndChapterName(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const chapterFile = Path.join(Config.get('datadir'), 'books', ctx.params.bookName, `${ctx.params.chapterName}.json`);
            const chapterFileInfo = yield readFile(chapterFile);
            ctx.set('Content-Type', 'Application/json');
            ctx.body = chapterFileInfo;
        });
    }
    addBook(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const bookDir = Path.join(Config.get('datadir'), 'books', ctx.params.bookName);
            if (!fs.existsSync(bookDir)) {
                yield mkdir(bookDir);
            }
        });
    }
    addChapter(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const chapterFile = Path.join(Config.get('datadir'), 'books', ctx.params.currentBook, `${ctx.params.chapterName}.json`);
            if (!fs.existsSync(chapterFile)) {
                const data = ctx.request;
                yield writeFile(chapterFile, JSON.stringify(data.body));
            }
        });
    }
    edit(_) {
    }
    deleteBook(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const bookDir = Path.join(Config.get('datadir'), 'books', ctx.params.bookName);
            if (fs.existsSync(bookDir)) {
                yield rmdir(bookDir);
            }
        });
    }
    deleteChapter(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const chapterFile = Path.join(Config.get('datadir'), 'books', ctx.params.currentBook, `${ctx.params.chapterName}.json`);
            if (fs.existsSync(chapterFile)) {
                yield unlink(chapterFile);
            }
        });
    }
    deleteWord(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const chapterFile = Path.join(Config.get('datadir'), 'books', ctx.params.currentBook, `${ctx.params.chapterName}.json`);
            const bufferChapterFileInfo = yield readFile(chapterFile);
            let chapterFileInfo = JSON.parse(bufferChapterFileInfo.toString());
            let { words } = chapterFileInfo;
            words = words.filter((word) => word !== ctx.params.word);
            yield writeFile(chapterFile, JSON.stringify(chapterFileInfo = { words }));
        });
    }
}
tslib_1.__decorate([
    decorator_1.route('get', '/api/books')
], WordController.prototype, "list", null);
tslib_1.__decorate([
    decorator_1.route('get', '/api/books/:bookName')
], WordController.prototype, "getChapter", null);
tslib_1.__decorate([
    decorator_1.route('get', '/api/books/:bookName/:chapterName')
], WordController.prototype, "getInfoByBookNameAndChapterName", null);
tslib_1.__decorate([
    decorator_1.route('post', '/api/books/:bookName')
], WordController.prototype, "addBook", null);
tslib_1.__decorate([
    decorator_1.route('post', '/api/books/:currentBook/:chapterName')
], WordController.prototype, "addChapter", null);
tslib_1.__decorate([
    decorator_1.route('put', '/api/books')
], WordController.prototype, "edit", null);
tslib_1.__decorate([
    decorator_1.route('delete', '/api/books/:bookName')
], WordController.prototype, "deleteBook", null);
tslib_1.__decorate([
    decorator_1.route('delete', '/api/books/:currentBook/:chapterName')
], WordController.prototype, "deleteChapter", null);
tslib_1.__decorate([
    decorator_1.route('delete', '/api/books/:currentBook/:chapterName/:word')
], WordController.prototype, "deleteWord", null);
exports.default = WordController;
//# sourceMappingURL=Book.js.map