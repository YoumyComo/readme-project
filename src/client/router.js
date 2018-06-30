import * as React from 'react';
import {Router, Route} from 'react-router';
import {createBrowserHistory} from 'history';


import {Route, Switch} from 'react-router-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux'

import WordList from './pages/WordList';
import WordDetail from './pages/WordDetail';
import WordSpell from './pages/WordSpell';
import SetenceSpell from './pages/SetenceSpell';
import Business from './pages/Business';
import Signin from './pages/Signin';

import store  from './store';

// 问题6  为什么使用syncHistoryWithStore路由变化 但组件不变化   因为state没有变吗？
// const history = syncHistoryWithStore(createBrowserHistory(), store);
const  history = createBrowserHistory();
// let history = History | null ;
// if (!history) {
//     history = createBrowserHistory();
//   }


store.subscribe(() =>
    console.log(store.getState())
);



export default class Routes extends React.Component {
    
    dispatchRouter() {
        return (
            <Switch className = "app-container">
                            <Route  path="/qrcode/:qrcode" component={WordList}/>
                            <Route  path="/word_detail/:spell" component={WordDetail}/>
                            <Route  path="/word_spell/:spell" component={WordSpell}/>
                            <Route  path="/sentence_spell/:spell/:id" component={SetenceSpell}/>
                            <Route  path="/business" component={Business}/>
                            <Route  path="/signin" component={Signin}/>
             </Switch>
        )
    }

    render() {
        return(
            <Provider store={store}>
                <Router history={history}>
                    {this.dispatchRouter()}
                </Router>
          </Provider>
        )
    }

}
// );
// Routes.propTypes = {
//     history: PropTypes.any,
//   };

export default Routes;