import Router = require('koa-router');

import './Book';
import './Word';
import './QRCode';
import './Image';
import './Audio';
import './Favicon';
import './Monitor';
import './Entry';
import './InitState';
import './Signin';

import {setRouter} from './decorator';

const router = new Router();
setRouter(router);
export default router.routes();
