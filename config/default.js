const path = require('path');
module.exports = {
  port: 8080,
  isDev: false,
  isProd: false,
  root: path.resolve(__dirname, '..'),
  // 是否开启服务端渲染
  serverRender: false,
  webpack: {
    host: 'localhost',
    port: 8081,
  },
  thrift: {
    consumer: '',
    provider: '',
  },
  sentry: {
    server: {
      DSN: '',
    },
    client: {
      DSN: 'test',
    }
  },
  mta: {
    nodejs: {
      token: 'ss',
    },
    browser: {
      token: '',
    }
  },
  buildService: {
    host: 's0.meituan.net',
    app: '',
  }
}
