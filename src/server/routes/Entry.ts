import {Context} from 'koa';
import config = require('config');

import {fileResolver, chunkResolver} from '@server/lib/requireExtensions';
import ServerError from '@server/lib/error';
import {route} from './decorator';
import InitState from './InitState';

export let isDev: Boolean = config.get('isDev');

export default class EntryController {

  initState = new InitState();

  scriptsTag(scripts: string | string[]): string {
    const scriptTag = (s: string): string => {
      if (s.match(/css$/)) {
        return `<link href="${s}" rel="stylesheet" type="text/css">`;
      } else {
        return `<script crossorigin src="${s}" type="text/javascript"></script>`
      }
    };
    if (Array.isArray(scripts)) {
      return scripts.map(s => scriptTag(s)).join('');
    }
    return scriptTag(scripts);
  }

  /**
   * web 首页
   */
  @route('get', '*')
  async index(ctx: Context) {
    if (!ctx.accepts('html')) {
      throw new ServerError({
        ignore: true,
        status: 406,
        message: 'Not Acceptable',
      });
    }
    // 主 js 文件
    const mainFile = chunkResolver('app') || fileResolver('/static/app.js');
    // 页面的状态
    const initState = await this.initState.getState(ctx) || null;

    let chunks: string[] = [];
    let appStr = '';

    const browserConfig = {};
    return `<html>
      <head>
        <title></title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <script>var config = ${JSON.stringify(browserConfig)}</script>
        <script>var initState = ${JSON.stringify({
      [ctx.path]: initState,
    })}</script>
        ${this.scriptsTag(mainFile)}
        ${chunks.map(c => {
      const f = chunkResolver(c);
      if (!f) return null;
      return this.scriptsTag(f);
    }).filter(Boolean).join('')}
      </head>
      <body>
        <div id="app">${appStr}</div>
      </body>
    </html>`;
  }
}
