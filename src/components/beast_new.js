import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'; // almost identical to <a> tag
import $ from 'jquery';

import {addBeast} from './../redux/actions/actions';
import './../styles/App.css';

class BeastNew extends Component {
  constructor(){
      super();
      this.state = {
        imgSrc: null
      }
      this.onSubmit = this.onSubmit.bind(this);
  }

/**********************************************/
  onSubmit(){
    const values = {
      region: document.getElementById('region').value,
      type: document.getElementById('type').value,
      name: document.getElementById('name').value,
      location: document.getElementById('location').value,
      image: this.state.imgSrc,
      buy: $('#buy').prop('checked'),
      rent: $('#rent').prop('checked'),
      description: document.getElementById('description').value,
      contactId: this.props.user.user._id
    }
// console.log("buy"+values.buy+" rent"+values.rent)
    let formdata = new FormData();
    formdata.append('image', values.image);
    formdata.append('region', values.region);
    formdata.append('type', values.type);
    formdata.append('name', values.name);
    formdata.append('location', values.location);
    formdata.append('buy', values.buy);
    formdata.append('rent', values.rent);
    formdata.append('description', values.description);
    formdata.append('contactId', values.contactId);

    this.props.addBeast(
      formdata,
      ()=>{
        this.props.history.push('/beasts');
        // this.context.router.history.push('/beasts') ;
      } //must match the path in 1 of the <Route> tag
    );
  }

/**********************************************/
  onClickCamera(){
      this.refs.fileUploader.click(); //click on the hidden <input type="file"...>
  }
/**********************************************/
  previewImage () {
      const file = this.refs.fileUploader.files[0];
      if (!file) return;

      // let imgurl = URL.createObjectURL(file);

      var reader = new FileReader();
      reader.onload = function (event) {
        document.getElementById('image_preview').src = event.target.result

        this.setState({
          imgSrc: file
        })
      }.bind(this)

      reader.readAsDataURL(file);
  }

/**********************************************/
  render(){

    return (
      <div className='container'>
      <div id='beast-new-div'>

      <form>

{/*===== Image related rendering ===========*/}
          <div className={this.state.imgSrc != null ? 'file-upload-previewer' : 'file-upload-previewer hidden'}>
            <img className="card-img-top" src="" alt="" id="image_preview"/>
          </div>

          <div className="form-group">
            <span className="picture_upload">
              <i className="fa fa-camera" onClick={this.onClickCamera.bind(this)}></i>
            </span>
          </div>

           <div className="hidden">
              <input name="image" type="file" onChange={this.previewImage.bind(this)} ref="fileUploader" />
           </div>

{/*===== End Image related rendering ===========*/}

    {/*<!-- Name of Beast -->*/}
          <div className="form-group">
            <input type="text" className=" form-control" id='name' placeholder="Name of the beast"/>
          </div>
    {/*<!-- Type of Beast -->*/}
          <div className="form-group">
            <select className=" form-control" id='type'>
              <option>yak</option><option>camel</option><option>mule</option><option>stallion</option><option>llama</option>
            </select>
          </div>
    {/*<!-- Region -->*/}
          <div className=" form-group">
            <select className=" form-control" id='region'>
              <option>Tibet</option><option>Pamir</option><option>Mongolia</option><option>Taklamakan</option><option>Sahara</option><option>Andes</option>
            </select>
          </div>
    {/*<!-- Location of Beast -->*/}
          <div className="form-group">
            <input type="text" className=" form-control" id='location' placeholder="Location/serving area of the beast"/>
          </div>
    {/*<!-- available for rent/buy -->*/}
          <div className="form-group">
            <input className=" form-check-input" type="checkbox" id='rent'/>
            <label className=" form-check-label" >Available for hire</label>
          </div>
          <div className="form-group">
            <input className=" form-check-input" type="checkbox" id='buy'/>
            <label className=" form-check-label" >Available for purchase</label>
          </div>
    {/*<!-- Description -->*/}
          <div className="form-group">
            <textarea className=" form-control" id='description' placeholder="Description"></textarea>
          </div>

        </form>
        <button onClick={()=>this.onSubmit()} className='btn btn-success'>Submit</button>
        <Link className='go-back' to='/beasts'>Cancel</Link>
        </div>
        </div>
      ); //end return
  } // end render

} // end class BeastNew

/*================= mapStateToProps =================*/
function mapStateToProps( state){

  return { user: state.user };
/* 'state' refers to the application state defined in reducer.js
state.user here refers to the "user" property in combineReducers.
The statement above basically maps the "state" in reducer_user.js to
this.props.user in this container.
*/
}
/*====================================================*/
export default connect(mapStateToProps, {addBeast}) (BeastNew);
