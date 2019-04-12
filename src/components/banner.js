import React, {Component} from 'react';
import { Link } from 'react-router-dom'; // almost identical to <a> tag
import { connect } from 'react-redux'; //only need to pull out a property 'connect' from the react-redux package

import './../styles/App.css';


class Banner extends Component {

  render(){
    return (
      <div id="banner"  className="jumbotron">
          <div className='container'>
            <h1>A beast is your best pal in the wild</h1>
            <h5>Find a beast to carry your burden in your next wild adventure!</h5>
            <br/>
            <Link to={"beasts/new"}>
              <button className={this.props.isAuth ? "btn btn-success" : "btn btn-success disabled"} >
                  Register Beast</button>
            </Link>
            <em className={!this.props.isAuth ? '' : 'hidden'}>login to register beast</em>
          </div>
      </div>

    );
  }
}

/*================= mapStateToProps =================*/
function mapStateToProps( state){

  return {
           isAuth: state.user.isAuth
         };
}

export default connect(mapStateToProps)(Banner);
