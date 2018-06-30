"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const crypto = require("crypto");
function aesDecrypt(encrypted, secretkey) {
    const decipher = crypto.createDecipher('aes192', secretkey);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
exports.default = (ctx, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const path = ctx.url;
    const authorityPaths = ['/api/books', '/business'];
    return next();
    if (authorityPaths.find(p => path.startsWith(p))) {
        console.log('权限网页');
        const cookieValue = ctx.cookies.get('token');
        const secretkey = 'sjdifual';
        const decryptCookieValue = aesDecrypt(cookieValue, secretkey);
        const cookieValueArr = decryptCookieValue.split(':');
        if (cookieValueArr[1] === '654321' && cookieValueArr[0] === 'aaaa') {
            console.log('cookie验证成功');
            yield next();
        }
        else {
            ctx.throw(403);
        }
    }
    else {
        yield next();
    }
});
//# sourceMappingURL=auth.js.map