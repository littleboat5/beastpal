import React, { Component } from 'react';
import { connect } from 'react-redux'; //only need to pull out a property 'connect' from the react-redux package
import { Link } from 'react-router-dom'; // almost identical to <a> tag
import $ from 'jquery';

import {getBeast4Update, updateBeast} from './../redux/actions/actions';
import './../styles/App.css';

class BeastEdit extends Component {
  constructor(){
      super();
      this.state = {
        imgSrc: null
      }
      this.onSubmit = this.onSubmit.bind(this);
      this.renderCheckBox = this.renderCheckBox.bind(this);
  }
/* ================================================*/
  componentDidMount(){
    const {id} = this.props.match.params;
    this.props.getBeast4Update(id);
  }


/**********************************************/
  onSubmit(){
    const values = {
      region: document.getElementById('region').value,
      type: document.getElementById('type').value,
      name: document.getElementById('name').value,
      location: document.getElementById('location').value,
      buy: $('#buy').prop('checked'),
      rent: $('#rent').prop('checked'),
      description: document.getElementById('description').value,
      contactId: this.props.beast.contactId
    }

    let formdata = new FormData();

    if(this.state.imgSrc)
      formdata.append('image', this.state.imgSrc);

    formdata.append('region', values.region);
    formdata.append('type', values.type);
    formdata.append('name', values.name);
    formdata.append('location', values.location);
    formdata.append('buy', values.buy);
    formdata.append('rent', values.rent);
    formdata.append('description', values.description);
    formdata.append('contactId', values.contactId);

    this.props.updateBeast(
      this.props.beast._id,
      formdata,
      ()=>{
        this.props.history.push(`/beasts/${this.props.beast._id}`);
      }
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
  renderCheckBox(id, checked){
    if( checked )
      return(
        <input className=" form-check-input" type="checkbox" id={id} defaultChecked/>
      );
    else
      return(
        <input className=" form-check-input" type="checkbox" id={id}/>
      );
  }
/**********************************************/
  render(){
   const {beast} = this.props;

    return (
      <div className='container'>
      <div id='beast-new-div'>

      <form>

{/*===== Image related rendering ===========*/}
        <div className={ beast.image != null || this.state.imgSrc != null
              ? 'file-upload-previewer' : 'file-upload-previewer hidden'}>
          <img className="card-img-top" src={beast.image} alt="" id="image_preview"/>
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
          <input type="text" className="form-control" id='name' defaultValue={beast.name}/>
        </div>
  {/*<!-- Type of Beast -->*/}
        <div className="form-group">
          <select className=" form-control" id='type' defaultValue={beast.type}>
            <option>yak</option><option>camel</option><option>mule</option><option>stallion</option><option>llama</option>
          </select>
        </div>
  {/*<!-- Region -->*/}
        <div className=" form-group">
          <select className=" form-control" id='region' defaultValue={beast.region}>
            <option>Tibet</option><option>Pamir</option><option>Mongolia</option><option>Taklamakan</option><option>Sahara</option><option>Andes</option>
          </select>
        </div>
  {/*<!-- Location of Beast -->*/}
        <div className="form-group">
          <input type="text" className=" form-control" id='location' defaultValue={beast.location} placeholder="Location/serving area of the beast"/>
        </div>
  {/*<!-- available for rent/buy -->*/}
        <div className="form-group">
          {this.renderCheckBox('rent', beast.rent)}
          <label className=" form-check-label" >Available for hire</label>
        </div>
        <div className="form-group">
          {this.renderCheckBox('buy', beast.buy)}
          <label className=" form-check-label" >Available for purchase</label>
        </div>
  {/*<!-- Description -->*/}
        <div className="form-group">
          <textarea className=" form-control" id='description' defaultValue={beast.description}></textarea>
        </div>

      </form>

      <button onClick={()=>this.onSubmit()} className='btn btn-success'>Update</button>
      <Link className='go-back' to={`/beasts/${beast._id}`}>Cancel</Link>

      </div>
      </div>
      ); //end return
  } // end render

} // end class BeastEdit

/*================= mapStateToProps =================*/
function mapStateToProps(state){

  return { beast: state.beasts.beast,
           user: state.user
         };
}
/*====================================================*/
export default connect(mapStateToProps, {getBeast4Update, updateBeast}) (BeastEdit);
