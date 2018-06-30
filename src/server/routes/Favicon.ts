import {route} from './decorator';
import {Context} from 'koa';

export default class Favicon {
  @route('get', '/*/favicon.ico')
  ico(ctx: Context) {
    ctx.status = 204;
  }
}
