"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("config");
require('module-alias/register');
if (config.get('isDev')) {
    Promise.resolve().then(() => require('./dev-server'));
}
else {
    const port = config.get('port');
    Promise.resolve().then(() => require('./app')).then(app => {
        app.default().listen(port, () => {
            console.log('server is listen on port:', port);
        });
    });
}
//# sourceMappingURL=index.js.map