import React, { Component } from 'react';
import './../styles/App.css';


class Reviews extends Component {
  constructor(){
      super();

      this.renderEditButtons = this.renderEditButtons.bind(this);
      this.renderReview = this.renderReview.bind(this);
      this.renderSubmitButton = this.renderSubmitButton.bind(this);
      this.onSubmit = this.onSubmit.bind(this);
  }

/* ================================================*/
  renderEditButtons(review){

    function onDeleteClick(){
      this.props.notifyParentOfDelete(review._id);
    }

    return(
      <div className="d-inline">
        <button id='review-del' className='text-danger bg-light' onClick={onDeleteClick.bind(this)} >
            <i className="fas fa-trash-alt "></i>
        </button>
      </div>
    );
  }

/* ================================================*/
  renderReview(review){

    return (
      <div key={review._id}>
        <p className="card-title">
            <em>Review by <strong>{review.author.name} </strong>
            <span className="float-right"><small className="text-muted">{review.updatedAt.substring(0,19)}</small></span></em>
        </p>

        <div className="card-text">
          {review.text}
          {review.author.id === this.props.user_id ? this.renderEditButtons(review) : "" }
        </div>
        <hr/>

      </div>
    );
  }
/* ================================================*/
  renderSubmitButton(){
    if (this.props.user_id ) //user is login
      return(
        <div>
          <button onClick={()=>this.onSubmit()} className='btn btn-success'>Submit</button>
        </div>
      );
    else
      return(
        <div>
          <button onClick={()=>this.onSubmit()} className='btn btn-success' disabled>Submit</button>
          <em>login to submit review</em>
        </div>
      );
}
/* ================================================*/
  onSubmit(){
    let formdata = {
      'text': document.getElementById('text').value
    }
    this.props.notifyParentOfAdd(formdata);

    document.getElementById('text').value = "";
  }

/* ================================================*/
  render(){

    const {reviews} = this.props;

    return(
      <div id="reviewSection" className="card bg-light mb-3">
{/*--- New review editor ----*/}
        <div className="card-body" id="review_new">
          <form>
            <div className="form-group">
              <textarea className="form-control" id='text' placeholder="Write a new review..."></textarea>
            </div>
          </form>
          {this.renderSubmitButton()}
        </div>

        <div className="card-body">
          {reviews.map( this.renderReview )}
        </div>
      </div>
    );
  }
}

export default Reviews;
