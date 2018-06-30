import {route} from './decorator';
import * as Config from 'config';
import {Context} from 'koa';
import {promisify} from 'util';
import * as fs from 'fs';
import * as Path from 'path';

const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const writeFile = promisify(fs.writeFile);

export default class WordController {
  @route('get', '/api/words')
  async list(ctx: Context) {
    const filepath = Path.join(Config.get('datadir'), 'words');
    ctx.body = (await readdir(filepath)).map(d =>  Path.basename(d, '.json'));
  }

  @route('post', '/api/business/:bookName/:chapterName')
  async add(ctx: Context) {
     // tslint:disable-next-line:no-any
    const data = ctx.request as any;
    let dataBody = data.body;
    console.log('Submit data:', dataBody)
    const {word} = dataBody;
    const wordFilePath = Path.join(Config.get('datadir'), 'words', `${word}.json`);
    await writeFile(wordFilePath, JSON.stringify(dataBody));
  }

  @route('get', '/api/words/:spell')
  get(ctx: Context) {
    const { spell } = ctx.params;
    ctx.set('Content-Type', 'Application/json');
    const filepath = Path.join(Config.get('datadir'), 'words', `${spell}.json`);
    ctx.body = fs.createReadStream(filepath);
  }

  @route('put', '/api/words')
  edit(_: Context) {

  }

  @route('delete', '/api/words/:id')
  delete(_: Context) {

  }
}
