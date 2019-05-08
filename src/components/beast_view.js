import 'react-dates/initialize';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import { Link } from 'react-router-dom';

import {getBeast, deleteBeast, getUser, deleteReview, addReview} from './../redux/actions/actions';
import './../styles/App.css';
import Reviews from './reviews';
import Reserve from './reserve';
import GoogleMap from './map';

class BeastView extends Component {
  constructor(){
      super();
      this.state = {
/* this.props.owner may not always point to the same user as this.props.beast.contactId
because this.props.owner is fetched by a different API and that API can only be
called AFTER the getBeast API returns and beast is rendered.
Hence, we use the local state to sync up with this.props.owner, then in
getDerivedStateFromProps, we can compare this with this.props.beast.contactId
to see if we need to get the user info again
*/
        bb_owner: {}
      }
      this.onDeleteReview = this.onDeleteReview.bind(this);
      this.onAddReview = this.onAddReview.bind(this);
  }
/* ================================================*/
  componentDidMount(){
    const {id} = this.props.match.params; //id = this.props.match.params.id

    this.props.getBeast(id);
  }

  /* ================================================*/
  static getDerivedStateFromProps(props, state){
    if( Object.keys(props.beast).length !== 0 )//if beast info is loaded
      if (   Object.keys(state.bb_owner).length===0  //AND beast owner info is not yet retrieved
          || props.beast.contactId !== state.bb_owner._id //OR another beast is selected, curr owner info is old
        ){
          props.getOwner(props.beast.contactId, true);//get user info from API
      }
/*update the local state with whatever is current in props.owner, which may not be
the same owner the above props.getOwner action is getting. This is due to Ajax
natural of these API calls. Hence, getOwner may be called couple more times
before it finally sync up and the calls will stop
*/
    return {
      bb_owner: props.owner
    } //upon return, this.state.bb_owner will be === this.props.owner
  }
/* ================================================*/
  onDeleteClick(){
    const {id} = this.props.match.params;
    this.props.deleteBeast(id, ()=>{
       this.props.history.push('/beasts');
   });
  }
/* ================================================*/
  onDeleteReview(review_id) {
    const {id} = this.props.match.params;
    this.props.deleteReview(id, review_id);
  }
/* ================================================*/
  onAddReview(reviewFields) {
    const {id} = this.props.match.params;

    let formdata = new FormData();

    formdata.append('text', reviewFields.text);
    formdata.append('authorId', this.props.user._id);

    this.props.addReview(id, formdata);
  }
/* ================================================*/
  render(){
    const {beast, owner, user} = this.props;

    if (!beast && !owner) { //handle the FIRST render before the componentDidMount is called
      return <div>loading...</div>;
    }

    let {lng, lat, location} = this.props.beast;

    return (
      <div className="container">
        <div className="beast-detail row">

{/*  <!-- SIDE BAR - occupies 3/12 of the width*/}
          <div className="col-md-3">
{/*<!-- MAP */}
           <p>Serving Location: {beast.location}</p>
  {/*          <GoogleMap lng={lng} lat={lat} location={location} wait={2000}/>*/}
          </div>

{/* <!-- MAIN AREA - occupies 9/12 of the width*/}
          <div className="col-md-9">
              <div className="card border-0" >
                <img className={beast.image ? "card-img-top" : "card-img-top hidden"}
                      src={beast.image} alt=''/>
                <div className="card-body">

                  <h6 className="float-right">
                    <span className="rentbuy">Hire{'\u00A0'}
                    {beast.rent ? <i className="fa fa-check fa-sm" aria-hidden="true"></i> :
                                  <i className="fa fa-times fa-sm" aria-hidden="true"></i>
                    }</span>
                    <span className="rentbuy">Buy{'\u00A0'}
                    { beast.buy ? <i className="fa fa-check fa-sm" aria-hidden="true"></i> :
                                  <i className="fa fa-times fa-sm" aria-hidden="true"></i>
                    }</span>
                  </h6>

                  <h5 className="card-title">{ beast.name}, a { beast.type} that serves the { beast.region} region</h5>
                  <p><em>Contact person: {owner.name}&nbsp;<small>{owner.email}</small></em></p>

                  <br/>
                  <p className="card-text">{beast.description}</p>
                </div>

{/*<!-- EDIT/DELETE BEAST BUTTONS */}
                <div className={user._id === owner._id ? "card-body" : "card-body hidden"}>
                  <Link className="btn btn-warning beastview-button" to={`/beasts/${beast._id}/edit`}>Edit Beast Details</Link>
                  <button className='btn btn-outline-danger beastview-button' onClick={this.onDeleteClick.bind(this)} >
                    Remove Beast
                  </button>
                </div>

{/* ------ RESERVATION SECTION ------*/}
                <div className="card-body" id='reservation'>
                  <button className="btn btn-success " data-toggle="collapse" data-target="#avail" href="#avail" >
                    Check {beast.name}'s availability
                  </button>

                  <div id="avail" className="collapse card mb-3 border-0">
                    <Reserve
                      beast_id={beast._id}
                      user_id={this.props.user._id}
                    />
                  </div>
                </div>
              </div>

              <div className="card mb-3 border-0 ">
                  <Link className="go-back" to="/beasts"><i className="fas fa-arrow-alt-circle-left fa-lg"></i></Link>
              </div>

{/* ------ REVIEWS SECTION ------*/}
              <Reviews reviews={this.props.reviews}
                       beast_id={beast._id}
                       user_id={this.props.user._id}
                       notifyParentOfDelete={this.onDeleteReview}
                       notifyParentOfAdd={this.onAddReview} />

          </div>
        </div>
      </div>
    ); // end return
  }// end render
}//end BeastView

/*================= mapStateToProps =================*/
function mapStateToProps( state){

  return {beast: state.beasts.beast, // current beast in view
          user: state.user.user,
          owner: state.user.beastOwner,
          reviews: state.beasts.reviews // reviews for the current beast
         };
/*
The statement above basically maps the "state" in reducer_beasts.js to
this.props.beast in this container.
*/
}

/*================= mapDispatchToProps =================*/
// make getBeast, deleteBeast available as this.props.getBeast/deletebeast etc

function mapDispatchToProps(dispatch){
  return bindActionCreators(
    { getBeast: getBeast,
      deleteBeast: deleteBeast,
      deleteReview: deleteReview,
      addReview: addReview,
      getOwner: getUser
    },
//the 2nd getBeast refers to the imported function from action creator
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(BeastView);
