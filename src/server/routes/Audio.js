"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorator_1 = require("./decorator");
const Config = require("config");
const fs = require("fs");
const Path = require("path");
const crypto = require("crypto");
const util_1 = require("util");
const youdao_1 = require("../services/youdao");
const youdao = new youdao_1.default();
const request = require('request');
const rename = util_1.promisify(fs.rename);
class AudioController {
    get(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { word } = ctx.params;
            const filepath = Path.join(Config.get('datadir'), 'audios', `${word}.mp3`);
            ctx.set('Content-Type', 'audio/mpeg');
            ctx.body = fs.createReadStream(filepath);
        });
    }
    add(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { word } = ctx.params;
            const translation = yield youdao.translate(word);
            const filepath = Path.join(Config.get('datadir'), 'audios', `${word}.mp3`);
            request(translation.speakUrl).pipe(fs.createWriteStream(filepath));
        });
    }
    postAudio(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { type } = ctx.params;
            const file = ctx.request.files.file;
            const hash = crypto.createHash('md5');
            const input = fs.createReadStream(file.path);
            const ext = Path.extname(file.name);
            const hex = yield new Promise((resolve, reject) => {
                input.on('readable', () => {
                    const data = input.read();
                    if (data)
                        hash.update(data);
                    else {
                        resolve(hash.digest('hex'));
                    }
                });
                input.on('error', reject);
            });
            const newPath = Path.join(Config.get('datadir'), 'audios', `${type}`, `${hex}${ext}`);
            yield rename(file.path, newPath);
            return {
                url: `/api/audios/${type}/${hex}${ext}`,
            };
        });
    }
}
tslib_1.__decorate([
    decorator_1.route('get', '/api/audios/:word')
], AudioController.prototype, "get", null);
tslib_1.__decorate([
    decorator_1.route('put', '/api/audios/:word')
], AudioController.prototype, "add", null);
tslib_1.__decorate([
    decorator_1.route('post', '/api/audios/:type')
], AudioController.prototype, "postAudio", null);
exports.default = AudioController;
//# sourceMappingURL=Audio.js.map