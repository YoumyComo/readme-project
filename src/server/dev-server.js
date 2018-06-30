"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const WebpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");
const config = require("config");
const path = require("path");
const http = require("http");
const root = config.get('root');
const webpackConfig = require(path.resolve(root, './config/webpack.dev.js'));
const compiler = webpack(webpackConfig);
const server = new WebpackDevServer(compiler, {
    publicPath: webpackConfig.output.publicPath,
    hot: true,
    headers: {
        'Access-Control-Allow-Origin': '*'
    }
});
server.listen(config.get('webpack.port'), '0.0.0.0');
http.createServer(function (req, res) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        Object.keys(require.cache).forEach((module) => {
            if (!module.match(/node_modules/)) {
                delete require.cache[module];
            }
        });
        const createApp = yield Promise.resolve().then(() => require('./app'));
        const app = createApp.default();
        app.callback()(req, res);
    });
}).listen(config.get('port'), () => {
    console.log('dev server is listen on port:', config.get('port'));
});
//# sourceMappingURL=dev-server.js.map