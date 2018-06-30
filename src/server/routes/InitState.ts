import {route, match} from './decorator';
import {Context} from 'koa';
import {HomePageInitState} from '@src/declarations/state';

const prefix = '/state';
export default class PageStageController {
  // tslint:disable-next-line:no-any
  getState(ctx: Context): any {
    const result = match(this, `${prefix}${ctx.path}`);
    if (result) {
      ctx.params = result.params;
      return result.fn.call(this, ctx);
    }
    return null;
  }

  @route('get', `${prefix}/`)
  index(ctx: Context): HomePageInitState {
    ctx;
    return {
      title: 'hello world',
    };
  }

  @route('get', `${prefix}/*`)
  notFound() {
    return {};
  }
}
