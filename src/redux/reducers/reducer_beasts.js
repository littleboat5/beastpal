import { LOAD_BEASTS, VIEW_BEAST, EDIT_BEAST, DELETE_REVIEW, ADD_REVIEW }
    from '../actions/actions';

const initialState = {
    beasts: [],
    beast: {},
    reviews:[]
}

// export default function (state = initialState, action) {
export default (state=initialState, action) => {

  switch (action.type) {
    case LOAD_BEASTS :
      return {
          ...state,
          beasts: action.payload
      };

    case VIEW_BEAST:
      return {
          ...state,
          beast: action.payload,
          reviews: action.payload.reviews
      }

    case EDIT_BEAST:
      return {
          ...state,
          beast: action.payload
      }

    case DELETE_REVIEW:
        const deletedId = action.deletedReview._id;
        const newList =
            state.reviews.filter( //filter OUT the deleted review
                rv => rv._id !== deletedId );

        return {
          ...state,
          reviews: newList
        };

    case ADD_REVIEW:
      const newList2 = [action.newReview, ...state.reviews]
      return {
        ...state,
        reviews: newList2
      };

    default:
        return state;
  }
}
