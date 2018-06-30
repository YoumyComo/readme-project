import * as React from 'react';
// import {Router} from 'react-router';
// import {createBrowserHistory, History} from 'history';
import {ServerRenderContext} from '../declarations/context';
import './App.scss';
import Routers from './router';


// let history: History | null = null;
export type Props = {
  url?: string,
  context: ServerRenderContext,
}

export default class App extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return  <Routers/>;
  }
}
