import React = require('react');
import ReactDOM = require('react-dom');
import {getInitState} from './services/state';

export function render() {
  const App = require('./App').default;
  const container = document.createElement('div');

  ReactDOM.render(
    <App context={{
      dependences: {},
    }} getInitState={getInitState}/>,
    container,
  );

  const app = document.getElementById('app');
  container.id = 'app';
  if (app && app.parentElement) {
    app.parentElement.replaceChild(container, app);
  }
}

export const setRem = (window: Window) => {
  let fontSize = 14;
  if (window.innerWidth <= 425) {
    fontSize = window.innerWidth / 320 * fontSize;
  }
  document.documentElement.style.fontSize = fontSize + 'px';
}

/**
 * 为了单测，将全局执行的代码统一到一个function 里面
 * @return {[type]} [description]
 */
export function initPage(module: {}) {

  // webpack hot load
  // tslint:disable-next-line:no-any
  if ((module as any).hot) {
    // tslint:disable-next-line:no-any
    (module as any).hot.accept('./App', () => render())
  }

  document.addEventListener('DOMContentLoaded', () => {
    render();
  });

  setRem(window);
  window.addEventListener('resize', () => setRem(window));
}

initPage(module);
