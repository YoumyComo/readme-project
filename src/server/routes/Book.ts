import {route} from './decorator';
import * as Config from 'config';
import {Context} from 'koa';
import {promisify} from 'util';
import * as fs from 'fs';
import * as Path from 'path';

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);



export default class WordController {
  @route('get', '/api/books')
  async list(ctx: Context) {
    const bookDir = Path.join(Config.get('datadir'), 'books'); // 返回以book名作为值的数组
    const bufferBooksName = await readdir(bookDir);
    const data: {
      [k: string]: string[],
    } = {};
    await Promise.all(bufferBooksName.map(async (name: String) => {
      const files = await readdir(Path.join(bookDir, `${name}`));
      data[`${name}`] = files.map( file => Path.basename(file, '.json'));
    }));
    ctx.body = data;
  }

  @route('get', '/api/books/:bookName')
  async getChapter(ctx: Context) {
    debugger
    const bookDir = Path.join(Config.get('datadir'), 'books', ctx.params.bookName);
    const allChapters = await readdir(bookDir);
    ctx.body = allChapters.map(charpter => Path.basename(charpter, '.json'));
  }


  @route('get', '/api/books/:bookName/:chapterName')
  async getInfoByBookNameAndChapterName(ctx: Context) {
    const chapterFile = Path.join(Config.get('datadir'), 'books', ctx.params.bookName, `${ctx.params.chapterName}.json`);
    const chapterFileInfo = await readFile(chapterFile);
    ctx.set('Content-Type', 'Application/json');
    ctx.body = chapterFileInfo;
  }


  @route('post', '/api/books/:bookName')
  async addBook(ctx: Context) {
    const bookDir = Path.join(Config.get('datadir'), 'books', ctx.params.bookName);
    if (!fs.existsSync(bookDir)) {
      await mkdir(bookDir);
    }
  }
  @route('post', '/api/books/:currentBook/:chapterName')
  async addChapter(ctx: Context) {
    const chapterFile = Path.join(Config.get('datadir'), 'books', ctx.params.currentBook, `${ctx.params.chapterName}.json`);
    if (!fs.existsSync(chapterFile)) {
        // tslint:disable-next-line:no-any
      const data = ctx.request as any;
      await writeFile(chapterFile, JSON.stringify(data.body));
    }
  }


  @route('put', '/api/books')
  edit(_: Context) {

  }

  @route('delete', '/api/books/:bookName')
  async deleteBook(ctx: Context) {
    const bookDir = Path.join(Config.get('datadir'), 'books', ctx.params.bookName);
    if (fs.existsSync(bookDir)) {
      await rmdir(bookDir);
    }
  }

  @route('delete', '/api/books/:currentBook/:chapterName')
  async deleteChapter(ctx: Context) {
    const chapterFile = Path.join(Config.get('datadir'), 'books', ctx.params.currentBook, `${ctx.params.chapterName}.json`);
    if (fs.existsSync(chapterFile)) {
      await unlink(chapterFile);
    }
  }

  @route('delete', '/api/books/:currentBook/:chapterName/:word')
  async deleteWord(ctx: Context) {
    const chapterFile = Path.join(Config.get('datadir'), 'books', ctx.params.currentBook, `${ctx.params.chapterName}.json`);
    const bufferChapterFileInfo = await readFile(chapterFile);
    let chapterFileInfo = JSON.parse(bufferChapterFileInfo.toString());
    let {words} = chapterFileInfo;
    words = words.filter( (word: String) => word !== ctx.params.word);
    await writeFile(chapterFile, JSON.stringify(chapterFileInfo = {words}) );
  }

}
