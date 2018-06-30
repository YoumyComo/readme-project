import React = require('react');
import {isPromise} from '@src/utils/types';
import Net from '@client/lib/Net';
import {InitStates} from '@src/declarations/state';

const pendingMap: Map<string, Promise<InitStates>> = new Map();
const net = new Net([]);
let initState: {
  [url: string]: InitStates;
} = {};

// 前端的页面状态会在 script 标签中保存，参见 src/erver/routes/Entry
// tslint:disable-next-line:no-any
if (typeof window !== 'undefined' && typeof (window as any).initState !== 'undefined') {
  // tslint:disable-next-line:no-any
  initState = (window as any).initState;
}

/**
 * 设置页面状态，服务端渲染时需
 */
export function setPageInitState(pathname: string, state: InitStates) {
  initState[pathname] = state;
}

function _getInitState(pathname: string): InitStates | Promise<InitStates> {
  if (initState[pathname]) {
    return initState[pathname];
  }
  if (typeof window === 'undefined') {
    return null;
  }
  const p = net.request<InitStates>({
    method: 'GET',
    url: {
      pathname: `/state/${pathname}`,
    },
  })
    .then(res => res.data)
    .then(state => {
      initState[pathname] = state;
      pendingMap.delete(pathname);
      return state;
    }, err => {
      pendingMap.delete(pathname);
      throw err;
    });
  pendingMap.set(pathname, p);
  return p;
}

/**
 * 根据路径获取页面状态
 * 如果页面状态已经获取过一次，则直接返回
 * 否则则会发起 ajax 请求
 */
export function getInitState(// tslint:disable-next-line:no-any
                             component: React.Component<any, { initState: InitStates }>,
                             pathname: string,
                             cb?: (state: InitStates) => void,
                             init: boolean = true
                           ) {
  const runCB = (_s: InitStates) => {
    if (cb) {
      cb(_s);

      // 为了单元测试，暂时屏蔽做动画操作
      // if (typeof requestAnimationFrame === 'undefined') return;
      // requestAnimationFrame(() => {
      //   cb(_s);
      // })
    }
  };

  let p = pendingMap.get(pathname);
  if (!p) {
    const s = _getInitState(pathname);
    if (s && isPromise(s)) {
      s.then((_s: InitStates) => {
        component.setState({initState: _s});
        runCB(_s);
      });
    } else if (init) {
      // tslint:disable-next-line:no-any
      (component.state as any).initState = s;
      runCB(s);
    } else {
      component.setState({initState: s});
      runCB(s);
    }
  } else {
    return p.then(() => _getInitState(pathname))
      .then((s: InitStates) => {
        component.setState({initState: s});
        runCB(s);
      })
  }
}
