import Koa = require('koa');
const koaBody = require('koa-body');
import error from './error';
import log from './log';
import auth from './auth';


export default (app: Koa) => {
  app.use(auth);
  app.use(log);
  app.use(error);
  app.use(koaBody({
    multipart: true,
  }))
}
