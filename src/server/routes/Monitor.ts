// import {
//   Context,
// } from 'koa';
import {route} from './decorator';

export default class MonitorController {
  /**
   * 心跳 API
   */
  @route('get', '/api/monitor/alive')
  alive() {
    return {
      data: true,
    }
  }

  @route('get', '/api/somemethod')
  somemethod() {
    return 'haha';
  }
}
