import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import createRootReducer from './reducer';

//import { createLogger } from 'redux-logger'
// import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
// import reducer from './reducer';
import thunk from 'redux-thunk'

export const history = createBrowserHistory();

export const store = createStore(
    createRootReducer(history), // root reducer with router state
    {},
    compose(
      applyMiddleware(
        routerMiddleware(history), // for dispatching history actions
        thunk
      ),
    ),
  );



// the following exports concerning history are deprecated!!!
// import createHistory from 'history/createBrowserHistory';
// export const history = createHistory();
//
// // Build the middleware for intercepting and dispatching navigation actions
// //const myRouterMiddleware = routerMiddleware(history);
//
// const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
// export const store = createStoreWithMiddleware(reducer);

// export const store = createStore(
//   reducer,
//   composeWithDevTools(applyMiddleware(thunk))
// );
