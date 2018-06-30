"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const decorator_1 = require("./decorator");
const crypto = require("crypto");
function aesEncrypt(data, key) {
    const cipher = crypto.createCipher('aes192', key);
    let crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}
class SigninController {
    signin(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = ctx.request;
            const { username, password } = data.body;
            const secretkey = 'sjdifual';
            const registeredUsername = 'aaaa';
            const registeredPassword = '654321';
            if (username === registeredUsername && password === registeredPassword) {
                const asePassword = aesEncrypt(registeredUsername + ':' + registeredPassword + ':' + Date.now(), secretkey);
                ctx.cookies.set('token', asePassword);
            }
            else {
                ctx.throw(403);
            }
        });
    }
}
tslib_1.__decorate([
    decorator_1.route('post', '/api/signin')
], SigninController.prototype, "signin", null);
exports.default = SigninController;
//# sourceMappingURL=Signin.js.map