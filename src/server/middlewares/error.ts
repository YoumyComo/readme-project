import {
  Context,
} from 'koa';
import ServerError from '@server/lib/error';
import config = require('config');

export let isDev: Boolean = config.get('isDev');

function renderErrorHtml(e: ServerError) {
  return `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta charset=“utf-8”>
      <title></title>
    </head>
    <body>
      <h3>${e.message}</h3>
      ${e.code ? `<p>CODE:${e.code}</p>` : ' '}
      ${config.get('isDev') ?
    `<pre>${e.stack}</pre>` :
    `<script>
        var p = document.createElement('p');
        var timmer = 3;
        function updateTimmer() {
          p.innerText = timmer + '秒之后回到首页...';
        }

        setInterval(function() {
          if (timmer < 0) return;
          timmer--;
          updateTimmer();
          if (timmer === 0) location = '/';
        }, 1000);
        document.body.appendChild(p);
        updateTimmer();
      </script>
      `}
    </body>
  </html>
  `;
}

export default async (ctx: Context, next: Function) => {
  try {
    await next();
  } catch (e) {
    const err: ServerError = e;

    if (!err.ignore && !isDev) {
      console.error(err);
    }

    if (ctx.accepts('html')) {
      ctx.body = renderErrorHtml(err);
    } else if (ctx.accepts('json')) {
      const body: {
        message: string,
        code: number,
        stack?: string,
      } = {
        message: err.message,
        code: err.code,
      };

      if (isDev) {
        body.stack = err.stack;
      }
      ctx.body = body;
    } else {
      ctx.body = err.message;
    }

    if (!ctx.status || ctx.status === 200) {
      if (e.status) {
        ctx.status = err.status;
      } else {
        ctx.status = 500;
      }
    }

    // tslint:disable-next-line:no-console
    console.error('ERROR:', e);
  }
}
