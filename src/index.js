import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch} from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router'
import * as localForage from "localforage";

import './styles/index.css';
import App from './App';
// import { register } from './serviceWorker';

import {store, history} from "./redux/store";
import { SET_USER } from './constants';

/*===========================================================*/
/* Auth (login user data) is set in the login action */
  localForage.getItem('Auth')
    .then( (user)=>{
      if (user){
        store.dispatch({type: SET_USER, user: user});
      }
  });

/*============================================================*/
ReactDOM.render(

  <Provider store={store}>
    <ConnectedRouter history={history} >
        <Switch>
            <Route path="/" component={App} />
        </Switch>
    </ConnectedRouter>

  </Provider>

  , document.getElementById('root')

); //end ReactDOM.render

/*============================================================*/
// if ('serviceWorker' in navigator) {
//   navigator.serviceWorker
//    .register('/service_worker.js')
//    .then(function() {
//       console.log('Service Worker Registered');
//     });
// }

// register();
