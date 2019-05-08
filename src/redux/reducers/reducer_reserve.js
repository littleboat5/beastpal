import { GET_RESERVATIONS, GET_RESERVATION_BY_USER, ADD_RESERVATION, DELETE_RESERVATION, UPDATE_RESERVATION }
    from '../../constants';

const initialState = {
    reservations: [],
    reservation: {}
}

export default (state=initialState, action) => {

  switch (action.type) {
    case GET_RESERVATIONS :
      return {
          ...state,
          reservations: action.payload
      };
    case GET_RESERVATION_BY_USER:
      return {
          ...state,
          reservation: action.payload
      }
    case ADD_RESERVATION:
      return {
          ...state,
          reservation: action.newResv
      }

    case UPDATE_RESERVATION:

      return {
        reservations: state.reservations.map( rv=>{
          if( rv._id === action.updatedResv._id ){
            rv.startDate = action.updatedResv.startDate;
            rv.endDate = action.updatedResv.endDate;
          }
          return rv;
        }),
        reservation: action.updatedResv
      }

    case DELETE_RESERVATION:
        const deletedId = action.deletedResv._id;
        const newList =
            state.reservations.filter( //filter OUT the deleted reservation
                rv => rv._id !== deletedId );

        return {
          reservations: newList,
          reservation: {} //clear out my reservation
        };

    default:
        return state;
  }
}
