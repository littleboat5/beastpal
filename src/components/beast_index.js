import React, { Component } from 'react';
import { connect } from 'react-redux'; //only need to pull out a property 'connect' from the react-redux package
import { Link } from 'react-router-dom'; // almost identical to <a> tag

import {loadBeasts} from './../redux/actions/actions';
import './../styles/App.css';
import Banner from './banner';


class BeastIndex extends Component {
  constructor(){
      super();

      this.renderBeast = this.renderBeast.bind(this);
      this.renderImage = this.renderImage.bind(this);
  }
/*=============================================*/
  componentDidMount(){
// change the cursor to a spinning wheel
    document.getElementById('root').classList.add('loading');

    this.props.loadBeasts();
  }

/*=============================================*/
  renderImage(bob){
    if (bob.image)
      return (
        <img className="figure-img img-fluid img-thumbnail" src={bob.image} alt=''/>
      );
    else
      return (
        <i className="far fa-image fa-5x"></i>
      );
  }
/*=============================================*/
  renderBeast(bob){

    function onClickMore(){
      //show the full description
      document.getElementById(`bob-description${bob._id}`).innerHTML = bob.description;
      //hide the "...+" link
      document.getElementById(`bob-more${bob._id}`).classList.add('hidden');
      //show the "-" link
      document.getElementById(`bob-less${bob._id}`).classList.remove('hidden');
    }

    function onClickLess(){
      //show less description
      document.getElementById(`bob-description${bob._id}`).innerHTML = bob.description.substring(0, 25);
      //hide the "-" link
      document.getElementById(`bob-less${bob._id}`).classList.add('hidden');
      //show the "...+" link
      document.getElementById(`bob-more${bob._id}`).classList.remove('hidden');
    }

    return (
      <div className="col-xs-6 col-sm-4 col-lg-3" key={bob._id}>
        <figure className="figure">
          <Link to={`beasts/${bob._id}`}>{this.renderImage(bob)}</Link>
          <figcaption className="figure-caption">
            <strong>{bob.name}</strong>, a {bob.type} from {bob.region}
            <br/>
            <span id={`bob-description${bob._id}`}>
              {bob.description ? bob.description.substring(0, 25) : ""}
            </span>
    {/* ...+ OR - */}
            <button id={`bob-more${bob._id}`}
                  className={(bob.description && bob.description.length>25)
                           ? "text-info " : "text-info hidden" }
                  onClick={onClickMore.bind(this)} >
                <i className="fas fa-ellipsis-h"></i>
            </button>
            <button id={`bob-less${bob._id}`}
                  className="text-info hidden"
                  onClick={onClickLess.bind(this)} >
                <i className="far fa-minus-square"></i>
            </button>

          </figcaption>
        </figure>
      </div>
    );
  } // end renderBeast

/*=============================================*/

  render(){
    //change the curson back to its normal pointer form
    if(this.props.beasts && this.props.beasts.length > 0 )
      document.getElementById('root').classList.remove('loading');

    return (
      <div>
        <Banner />
        <div className='container'>
          <div className="row" > {/* call renderBeast() for each beast*/}
            {this.props.beasts.map( this.renderBeast )}
          </div>
        </div>
      </div>
    );
  } // end render()

}

/*================= mapStateToProps =================*/
function mapStateToProps( state){

  return { beasts: state.beasts.beasts,
           user: state.user.user
         };
}

export default connect(mapStateToProps, {loadBeasts})(BeastIndex);
