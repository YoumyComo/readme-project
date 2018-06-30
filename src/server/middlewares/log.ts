import koa = require('koa');
import config = require('config');

export let isDev: Boolean = config.get('isDev');

export default async (ctx: koa.Context, next: Function) => {
  if (isDev) return next();
  const start = new Date();
  await next();
  const end = new Date();
  const spend = end.getDate() - start.getDate();
  const log = ctx.status >= 400 ? console.error : console.log;
  log(ctx.status, ctx.method, ctx.path, ctx.querystring, 'SPEND:', spend);
  // tslint:disable-next-line:no-any
  const { body } = ctx.request as any;
  if (body && Object.keys(body).length) {
    log('REQ BODY', body);
  }
  if (ctx.body && typeof ctx.body !== 'string') {
    log('RES BODY', ctx.body);
  }
}
