"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const config = require("config");
const fs = require("fs");
const React = require("react");
const LazyLoad_1 = require("@client/components/LazyLoad");
const root = config.get('root');
const webpackHost = config.get('webpack.host');
const webpackPort = config.get('webpack.port');
const bsHost = config.get('buildService.host');
const bsApp = config.get('buildService.app');
exports.isDev = config.get('isDev');
exports.buildMeta = null;
if (!exports.isDev) {
    exports.buildMeta = JSON.parse(fs.readFileSync(path.join(root, 'buildMeta.json')).toString());
}
exports.assertResolver = (ext) => (m, filename) => {
    let file = path
        .relative(path.join(root, 'src', 'client'), filename)
        .split(path.sep)
        .join('/');
    if (exports.buildMeta) {
        const basename = path.basename(file, ext);
        const dirname = path.dirname(file);
        const asset = exports.buildMeta.assets.find(a => a.name.indexOf(`${dirname}/${basename}`) === 0);
        if (asset) {
            file = asset.name;
        }
    }
    m.exports = fileResolver(`/static/${file}`);
    return m;
};
exports.chunkResolver = (chunk) => {
    if (exports.buildMeta) {
        const file = exports.buildMeta.assetsByChunkName[chunk];
        if (file) {
            if (Array.isArray(file)) {
                return file.map(f => fileResolver(`/static/${f}`));
            }
            else {
                return fileResolver(`/static/${file}`);
            }
        }
    }
    return null;
};
function fileResolver(file) {
    let result = '';
    result = exports.isDev ? `//${webpackHost}:${webpackPort}${file}` : `//${bsHost}/bs/${bsApp}/@${file}`;
    return result;
}
exports.fileResolver = fileResolver;
;
function addRequireExt() {
    [
        '.png',
        '.jpg',
        '.jpeg',
        '.svg',
        '.gif',
        '.scss',
    ].forEach(ext => {
        require.extensions[ext] = exports.assertResolver(ext);
    });
    require.extensions['.async'] = (m, filename) => {
        const components = JSON.parse(fs.readFileSync(filename).toString());
        const result = {};
        Object.keys(components).forEach(k => {
            result[k] = (props) => React.createElement(LazyLoad_1.default, {
                loader: (cb) => cb(require(path.join(path.dirname(filename), components[k])).default),
                chunk: k,
                subProps: props,
            });
        });
        m.exports = {
            default: result,
        };
        return m;
    };
}
exports.addRequireExt = addRequireExt;
addRequireExt();
//# sourceMappingURL=requireExtensions.js.map