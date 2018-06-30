import {route} from './decorator';
import * as Config from 'config';
import {Context} from 'koa';
// import {promisify} from 'util';
import * as fs from 'fs';
import * as Path from 'path';
import * as crypto from 'crypto';
import {promisify} from 'util';

const rename = promisify(fs.rename);


export default class QRCodeController {
  @route('get', '/api/images/:name')
  async get(ctx: Context) {
    const { name } = ctx.params;

    const filepath = Path.join(Config.get('datadir'), 'images', `${name}`);
    ctx.set('Content-Type', 'image/jpeg');
    ctx.body = fs.createReadStream(filepath);
  }

  @route('post', '/api/images')
  async add(ctx: Context) {
    // tslint:disable-next-line:no-any
    const file = (ctx.request as any).files.file;

    const hash = crypto.createHash('md5');

    const input = fs.createReadStream(file.path);
    const ext = Path.extname(file.name);
    const hex = await new Promise((resolve, reject) => {
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
    // rename(file.path, newPath) 什么意思
    await rename(file.path, newPath);
    return {
      url: `/api/images/${hex}${ext}`,
    };
  }

}
