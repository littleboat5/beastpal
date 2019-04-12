import { SET_USER, SET_BEASTOWNER } from '../actions/actions';

const initialState = {
    user: {},
    isAuth: false,
    beastOwner:{}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
        return {
            ...state,
            isAuth: Object.keys(action.user).length > 0 ? true : false,
            user: action.user
        }

    case SET_BEASTOWNER:
        return {
            ...state,
            beastOwner: action.owner
        }
    default:
      return state;
  }
}
