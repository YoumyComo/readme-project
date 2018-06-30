import koa = require('koa');
import * as crypto from 'crypto';


function aesDecrypt(encrypted: string, secretkey: string) {
    const decipher = crypto.createDecipher('aes192', secretkey);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  export default async (ctx: koa.Context, next: Function) => {
    const path = ctx.url;
    const authorityPaths = ['/api/books', '/business'];
    return next();
    if (authorityPaths.find(p => path.startsWith(p))) {
        console.log('权限网页')
        const cookieValue = ctx.cookies.get('token');
        const secretkey = 'sjdifual';
        const decryptCookieValue = aesDecrypt(cookieValue, secretkey);
        const cookieValueArr = decryptCookieValue.split(':');
        if (cookieValueArr[1] === '654321' && cookieValueArr[0] === 'aaaa') {
            console.log('cookie验证成功')
            await next();
        } else {
            ctx.throw(403);
        }
    } else {
        // console.log('非权限网页')
        await next();
    }
}
