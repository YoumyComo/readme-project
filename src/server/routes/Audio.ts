import {route} from './decorator';
import * as Config from 'config';
import {Context} from 'koa';
// import {promisify} from 'util';
import * as fs from 'fs';
import * as Path from 'path';
import * as crypto from 'crypto';
import {promisify} from 'util';

import Youdao from '../services/youdao';

const youdao = new Youdao();
const request = require('request');


const rename = promisify(fs.rename);

export default class AudioController {
  @route('get', '/api/audios/:word')
  async get(ctx: Context) {
    const { word } = ctx.params;
    const filepath = Path.join(Config.get('datadir'), 'audios', `${word}.mp3`);
    ctx.set('Content-Type', 'audio/mpeg');
    ctx.body = fs.createReadStream(filepath);
  }

  @route('put', '/api/audios/:word')
   async add(ctx: Context) {
   const { word } = ctx.params;
   const translation = await youdao.translate(word);
   const filepath = Path.join(Config.get('datadir'), 'audios', `${word}.mp3`);

   request(translation.speakUrl).pipe(fs.createWriteStream(filepath));
  }

  @route('post', '/api/audios/:type')
  async postAudio(ctx: Context) {
    const { type } = ctx.params;
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
    const newPath = Path.join(Config.get('datadir'), 'audios', `${type}`, `${hex}${ext}`);
    // rename(file.path, newPath) 什么意思
    await rename(file.path, newPath);
    return {
      url: `/api/audios/${type}/${hex}${ext}`,
    };
  }

}
