import {route} from './decorator';
import {Context} from 'koa';
import * as crypto from 'crypto';


function aesEncrypt(data: string, key: string) {
    const cipher = crypto.createCipher('aes192', key);
    let crypted = cipher.update(data, 'utf8', 'hex');
        crypted += cipher.final('hex');
    return crypted;
}

export default class SigninController {
    @route('post', '/api/signin')
    async signin(ctx: Context) {
        // tslint:disable-next-line:no-any
        const data = ctx.request as any;
        const {username, password} = data.body;
        const secretkey = 'sjdifual';
        const registeredUsername = 'aaaa';
        const registeredPassword = '654321';

        if (username === registeredUsername && password === registeredPassword) {
            const asePassword = aesEncrypt(registeredUsername + ':' + registeredPassword + ':' + Date.now(), secretkey);
            ctx.cookies.set('token', asePassword);
        } else {
            ctx.throw(403);
        }
    }
}
