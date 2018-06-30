import * as config from 'config';

require('module-alias/register');

if (config.get('isDev')) {
  import('./dev-server');
} else {
  const port = config.get('port');
  import('./app')
    .then(app => {
      app.default().listen(port, () => {
        console.log('server is listen on port:', port);
      });
    })
}
