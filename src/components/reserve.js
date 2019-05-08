import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DateRangePicker, DayPickerRangeController } from 'react-dates';
import moment from 'moment';
import 'react-dates/lib/css/_datepicker.css';

import {getAllReserve, addReserve, deleteReserve, updateReserve} from './../redux/actions/actions';
import {START_DATE} from './../constants';
import './../styles/App.css';

class Reserve extends Component {

  constructor(){
      super();
      this.renderReserveButton = this.renderReserveButton.bind(this);
      this.onSaveReserve = this.onSaveReserve.bind(this);

      this.state = {
        beast_id: null,
        startDate: null,
        endDate: null,
        focusedInput: null,
        editMode: false
      }
    }

/* ================================================*/

  static getDerivedStateFromProps(props, state){

    if ( props.beast_id &&  // beast_id is loaded
         state.beast_id !== props.beast_id   //AND it's a new beast from prev view
    ){
      // supply the user id, if the user has a reservation on this beast,
      // getAllReserve will populate the corresponding state
      props.getAllReserve(props.beast_id, props.user_id);
    }

    return { beast_id: props.beast_id } //update local state to current beast
  }
/* ================================================*/
  onSaveReserve(){
    const {beast_id, startDate, endDate} = this.state;
    let formdata = new FormData();

    formdata.append('userId', this.props.user_id);
    formdata.append('startDate', startDate.toDate().toISOString());
    formdata.append('endDate', endDate.toDate().toISOString());
    formdata.append('beastId', beast_id);

    if( this.state.editMode ) //update reservation
      this.props.updateReserve(beast_id, this.props.myResv._id, formdata);
    else //create new reservation
      this.props.addReserve(beast_id, formdata);

    this.setState({
      editMode: false
    });
  }
/* ================================================*/
  onClickEdit(){

    this.setState({
      focusedInput: START_DATE,
      startDate: null,
      endDate: null,
      editMode: true
    });
  }
/* ================================================*/
  onCancelReserve(){
    this.props.deleteReserve(this.props.beast_id, this.props.myResv._id);

    this.setState({  //reset the date input fields
      startDate: null,
      endDate:null
    });

  }
/* ================================================*/
  renderReserveButton(hasResv){
    if( !this.props.user_id )
      return(
        <span>
          <button className='btn btn-success beastview-button' disabled>Reserve</button>
          <em>login to create reservation</em>
        </span>
      );
    else //show button if use has no reservation OR has reservation but wants to modify it
      return(
        <button className={
                  (!hasResv || this.state.editMode) ?
                  'btn btn-success beastview-button' : 'hidden'}
                onClick={this.onSaveReserve} >
          {this.state.editMode ? 'Update Reservation' : 'Reserve'}
        </button>
      );

  }
/* ================================================*/
  render(){
    const {user_id} = this.props;

// Check if user has reservation
    let hasResv = this.props.myResv //user seems to have a reservation
                  && Object.keys(this.props.myResv).length !== 0 //it does contains something
                  && user_id; //user is logged in

    let {focusedInput, startDate, endDate} = this.state;

    if (!user_id){ //no login user
      startDate = null;
      endDate = null;
    } else { //user has login, if user has reservation AND he's not modifying the date,
    //then display the reserved dates. Otherwise display whatever is in local state.
      startDate = hasResv && !this.state.editMode ? moment(this.props.myResv.startDate) : startDate;
      endDate = hasResv && !this.state.editMode ? moment(this.props.myResv.endDate) : endDate;
    }

//==== define isDayBlocked function to mark unavailable days
    const isDayBlocked = day =>{
      let notAvail = false;
      let {reserves} = this.props;
      //no reservations on this beast
      if( !reserves || reserves.length === 0 )
        return notAvail;

      for(var i=0; i<reserves.length; i++){
        //only consider reservations NOT in the past
        if( moment(reserves[i].endDate).isSameOrAfter(moment()) ){
          notAvail = day.isBetween( //if cal day is between (inclusive) the
              moment(reserves[i].startDate), //start and end date of exisitng reservations
              moment(reserves[i].endDate),   //then it is not available
              'day',
              '[]' );
          if( notAvail ) break;
        }
      }
      return notAvail;
    }
//=======================================================

    return(
      <div>
        <DateRangePicker
          startDate={startDate}
          startDateId="startDate_id"
          endDate={endDate}
          endDateId="endDate_id"
          onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })}
          focusedInput={focusedInput}
          onFocusChange={focusedInput => this.setState({ focusedInput })}
          isDayBlocked={isDayBlocked}
          disabled={hasResv && !this.state.editMode} //if user has a reservation, disable input
        />

        <p>
          {this.renderReserveButton(hasResv)}
          <button className={hasResv && !this.state.editMode? 'btn btn-success beastview-button' : 'hidden'}
              onClick={this.onClickEdit.bind(this)} >
            Edit reservation
          </button>
          <button className={hasResv && !this.state.editMode? 'btn btn-warning beastview-button' : 'hidden'}
              onClick={this.onCancelReserve.bind(this)} >
            Cancel reservation
          </button>
        </p>
      </div>
    );
  }
}


/*================= mapStateToProps =================*/
function mapStateToProps(state){

  return { reserves: state.reserve.reservations,
           myResv: state.reserve.reservation
         };
}
/*====================================================*/
export default connect(mapStateToProps,
  {getAllReserve, addReserve, deleteReserve, updateReserve}) (Reserve);
