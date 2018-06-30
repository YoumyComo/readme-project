import Koa = require('koa');
import routes from './routes';
import middlewares from './middlewares';

const app = new Koa();

export default () => {
  app.use(require('koa-compress')())
  middlewares(app);
  app.use(routes);

  return app;
}
