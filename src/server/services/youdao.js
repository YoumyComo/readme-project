"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const node_fetch_1 = require("node-fetch");
const URL = require("url");
const MD5 = require("md5");
const appKey = '72085995d3118292';
const appSecret = 'I5lFYwIu01jDpqxFfWA83p5F4yseJcXB';
class Youdao {
    getSign(word, salt) {
        return MD5(`${appKey}${word}${salt}${appSecret}`);
    }
    translate(word) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const salt = String(Date.now());
            const sign = this.getSign(word, salt);
            const url = URL.format({
                protocol: 'http',
                host: 'openapi.youdao.com',
                pathname: '/api',
                query: {
                    q: word,
                    from: 'EN',
                    to: 'zh_CHS',
                    appKey,
                    salt,
                    sign,
                }
            });
            const resp = yield node_fetch_1.default(url);
            const data = yield resp.json();
            return data;
        });
    }
}
exports.default = Youdao;
//# sourceMappingURL=youdao.js.map