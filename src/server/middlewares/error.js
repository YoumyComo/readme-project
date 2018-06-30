"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config = require("config");
exports.isDev = config.get('isDev');
function renderErrorHtml(e) {
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
exports.default = (ctx, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    try {
        yield next();
    }
    catch (e) {
        const err = e;
        if (!err.ignore && !exports.isDev) {
            console.error(err);
        }
        if (ctx.accepts('html')) {
            ctx.body = renderErrorHtml(err);
        }
        else if (ctx.accepts('json')) {
            const body = {
                message: err.message,
                code: err.code,
            };
            if (exports.isDev) {
                body.stack = err.stack;
            }
            ctx.body = body;
        }
        else {
            ctx.body = err.message;
        }
        if (!ctx.status || ctx.status === 200) {
            if (e.status) {
                ctx.status = err.status;
            }
            else {
                ctx.status = 500;
            }
        }
        console.error('ERROR:', e);
    }
});
//# sourceMappingURL=error.js.map