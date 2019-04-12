import { combineReducers } from 'redux';
import BeastsReducer from './reducers/reducer_beasts';
import UserReducer from './reducers/reducer_user';
import { connectRouter } from 'connected-react-router';

// deprecated!! import { routerReducer } from 'react-router-redux';

// how to use redux-form: https://redux-form.com/8.0.4/docs/gettingstarted.md/
// import { reducer as formReducer } from 'redux-form';

export default (history) => combineReducers({
    router: connectRouter(history),
    beasts : BeastsReducer,
    user: UserReducer
});

// export default combineReducers({
//   beasts : BeastsReducer,
//   user: UserReducer,
// //  form: formReducer, // must use keyword "form"
//   router: routerReducer
// });
