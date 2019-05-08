import axios from 'axios';
import * as localForage from "localforage";
import _ from 'lodash';

import {LOAD_BEASTS ,
        VIEW_BEAST ,
        CREATE_BEAST ,
        EDIT_BEAST,
        DELETE_REVIEW ,
        ADD_REVIEW ,
        SET_USER ,
        SET_BEASTOWNER ,
        LOGOUT_USER ,
        GET_RESERVATIONS ,
        GET_RESERVATION_BY_USER ,
        ADD_RESERVATION ,
        DELETE_RESERVATION ,
        UPDATE_RESERVATION } from '../../constants';

const ROOT_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api/' : '/api/';
// const ROOT_URL = '/api/';


/*=============== Load all beasts ================*/
export function loadBeasts () {
  const url = `${ROOT_URL}beasts`;

  // return (dispatch) => { axios
  //     .get(url)
  //     .then( (res) => { //res now contains the response from the ajax request
  //         let bbs = res.data;
  //         dispatch({type:LOAD_BEASTS, payload:bbs});
  //     })
  //
  //     .catch( (err) => console.log(err));
  // }

    return (dispatch) => {
//First, try loading from cache for faster display
      if ('caches' in window) {
        caches.match(url).then( (res)=>{
          if( res ){
            res.json().then( (bbs)=>{
              dispatch({type:LOAD_BEASTS, payload:bbs});
            })
          }
        })
      }

//then, make network request to get the latest data
      fetch(url)
      .then(handleFetchErrors) //handle http errors in separate function coz fetch doesn't handle them
      .then( (response)=>{
    // cache the latest data
        caches.open('beastpalData-v1')
        .then( (cache)=>{
          cache.put(url, response.clone() );
          // console.log('[ServiceWorker] Fetched & Cached', url, response);
          return response;
        })
        .then( (response)=>{
    // dispatch latest data to the reducers for display on screen
          response.json().then( (json)=>{
            dispatch({type:LOAD_BEASTS, payload:json});
          });
        });
      })
      .catch( (err) => console.log(err));
    }
}

/*=============== get 1 beast ================*/
export function getBeast (beast_id) {
    return (dispatch) => { axios
        .get(`${ROOT_URL}beasts/${beast_id}`)
        .then((res) => {
            let bb = res.data;
            dispatch({type: VIEW_BEAST, payload: bb});
        })
        .catch((err) => console.log(err));
    }
}
/*=============== get beast for update ================*/
export function getBeast4Update (beast_id) {
    return (dispatch) => { axios
        .get(`${ROOT_URL}beasts/${beast_id}/edit`)
        .then((res) => {
            let bb = res.data;
            dispatch({type: EDIT_BEAST, payload: bb});
        })
        .catch((err) => console.log(err));
    }
}

/*=============== add new beast ================*/
export function addBeast (values, callback) {
    return (dispatch) => { axios
        .post(`${ROOT_URL}beasts`, values)
        .then( ()=>callback() )
        .catch((err) => console.log(err));
    }
}
/*=============== update beast ================*/
export function updateBeast (beast_id, values, callback) {
// console.log(values)
    return (dispatch) => { axios
        .put(`${ROOT_URL}beasts/${beast_id}`, values)
        .then( ()=>callback() )
        .catch((err) => console.log(err));
    }
}
/*=============== delete 1 beast ================*/
export function deleteBeast (beast_id, callback) {
    return (dispatch) => { axios
        .delete(`${ROOT_URL}beasts/${beast_id}`)
        .then( ()=>callback() )
        .catch((err) => console.log(err));
    }
}
/*=============== get a user ================*/
export function getUser (user_id, beastOwner) {
    return (dispatch) => { axios
        .get(`${ROOT_URL}user/${user_id}`)
        .then((res)=>{
          if (beastOwner){
//if getting the beast owner user info, set the beastOwner state in reducer
            dispatch({type: SET_BEASTOWNER, owner: res.data});
          }
          else
            return res.data
        }).catch(err=>console.log(err));
  }
}

/*=============== Login user ================*/
export function login (user_data) {
    return (dispatch) => {
      axios.post(`${ROOT_URL}user`,user_data)
           .then((res)=>{
                let user = res.data;
 /* Below, we save the user into the local indexedDB so that the next time DOM is rendered,
the user is already authenticated and hence the BeastNew route is allowed.
The check for Auth occurs in src/index.js, before the ReactDOM.render
*/
                localForage.setItem('Auth', user)
                .catch( (err)=>{console.log('Error saving user data locally');})

                dispatch({type: SET_USER, user});  //=== {type: 'SET_USER', user:user}
            })
           .catch((err)=>console.log(err));
    }
}

/*=============== Logout user ================*/
export function logout() {
    return (dispatch) => {
      localForage.removeItem('Auth')
        .then( ()=>{console.log('User data removed from local storage');});

      dispatch({type: SET_USER, user: {}} );
    }
}

/*=============== delete 1 review ================*/
export function deleteReview(beast_id, review_id) {
    return (dispatch) => { axios
        .delete(`${ROOT_URL}beasts/${beast_id}/reviews/${review_id}`)
        .then((res) => {
            dispatch({type: DELETE_REVIEW, deletedReview: res.data});
        })
        .catch((err) => console.log(err));
    }
}
/*=============== add 1 review ================*/
export function addReview(beast_id, values) {

  return (dispatch) => { axios
      .post(`${ROOT_URL}beasts/${beast_id}/reviews`, values)
      .then((res) => {
          dispatch({type: ADD_REVIEW, newReview: res.data});
      })
      .catch((err) => console.log(err));
  }
}
/*=============== get all reservations for 1 beast ================*/
export function getAllReserve(beast_id, user_id) {
/* user_id can be null, if it is supplied, find also the reservation made by this
user within the list of resevations retrieved for this beast
*/
  const url = `${ROOT_URL}beasts/${beast_id}/reservations`;

  return (dispatch) => { axios
      .get(url)
      .then( (res) => {
//1. get all reservations for this beast
          dispatch({type:GET_RESERVATIONS, payload:res.data});
          return res.data;
      })
      .then( (data)=>{
//2. if a user_id is provided, find the reservation made by this user
        if( user_id ){
      //there may be multiple reservations made by this user, get the latest one
          const resByUser = _.orderBy( data.filter( obj=>obj.userId === user_id ), 'startDate', 'desc')
          if( resByUser ){
            dispatch({type:GET_RESERVATION_BY_USER, payload:resByUser[0]});
          }
        }
      })
      .catch( (err) => console.log(err));
  }

}
/*=============== add 1 reservation ================*/
export function addReserve(beast_id, values) {
  return (dispatch) => { axios
      .post(`${ROOT_URL}beasts/${beast_id}/reservations`, values)
      .then((res) => {
          dispatch({type: ADD_RESERVATION, newResv: res.data});
      })
      .catch((err) => console.log(err));
  }
}
/*=============== update reservation ================*/
export function updateReserve (beast_id, reserve_id, values) {
    return (dispatch) => { axios
        .put(`${ROOT_URL}beasts/${beast_id}/reservations/${reserve_id}`, values)
        .then((res) => {
            dispatch({type: UPDATE_RESERVATION, updatedResv: res.data});
        })
        // .then( ()=>callback() )
        .catch((err) => console.log(err));
    }
}
/*=============== remove 1 reservation ================*/
export function deleteReserve(beast_id, reserve_id) {
  return (dispatch) => { axios
      .delete(`${ROOT_URL}beasts/${beast_id}/reservations/${reserve_id}`)
      .then((res) => {
          dispatch({type: DELETE_RESERVATION, deletedResv: res.data});
      })
      .catch((err) => console.log(err));
  }
}

//====== Handle HTTP errors since fetch won't. =======
function handleFetchErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}
