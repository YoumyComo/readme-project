"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorator_1 = require("./decorator");
const Config = require("config");
const fs = require("fs");
const Path = require("path");
const crypto = require("crypto");
const util_1 = require("util");
const rename = util_1.promisify(fs.rename);
class QRCodeController {
    get(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { name } = ctx.params;
            const filepath = Path.join(Config.get('datadir'), 'images', `${name}`);
            ctx.set('Content-Type', 'image/jpeg');
            ctx.body = fs.createReadStream(filepath);
        });
    }
    add(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
            const newPath = Path.join(Config.get('datadir'), 'images', `${hex}${ext}`);
            yield rename(file.path, newPath);
            return {
                url: `/api/images/${hex}${ext}`,
            };
        });
    }
}
tslib_1.__decorate([
    decorator_1.route('get', '/api/images/:name')
], QRCodeController.prototype, "get", null);
tslib_1.__decorate([
    decorator_1.route('post', '/api/images')
], QRCodeController.prototype, "add", null);
exports.default = QRCodeController;
//# sourceMappingURL=Image.js.map