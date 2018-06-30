import {route} from './decorator';
import * as Config from 'config';
import {Context} from 'koa';
import {promisify} from 'util';
import * as fs from 'fs';
import * as Path from 'path';
const readFile = promisify(fs.readFile);

async function readJSON(file: string) {
    const buffer = await readFile(file);
    return JSON.parse(buffer.toString());
}

export default class QRCodeController {
  @route('get', '/api/qrcode/:id')
  async get(ctx: Context) {
    const { id } = ctx.params;

    const filepath = Path.join(Config.get('datadir'), 'qrcodes', `${id}.json`);
    const data = await readJSON(filepath);
    const charpterfile = Path.join(Config.get('datadir'), 'books', data.book, `${data.charpter}.json`);
    ctx.set('Content-Type', 'Application/json')

    const charpter = await readJSON(charpterfile);
    //  问题2： 详解？？？
    charpter.words = await Promise.all(charpter.words.map(async (word: string) => {
        const wordfile = Path.join(Config.get('datadir'), 'words', `${word}.json`);
        const wordInfo = await readJSON(wordfile);
        return {
            spell: wordInfo.spell,
            translation: wordInfo.translation,
        }
    }));
   // 问题3： 间歇KOA
    ctx.body = charpter;
  }
}
