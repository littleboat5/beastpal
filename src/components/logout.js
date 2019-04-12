import React, { Component } from 'react';
import { connect } from 'react-redux';

import './../styles/App.css';
import { logout } from './../redux/actions/actions';

class Logout extends Component {


  render(){
    function onClickLogout(){
        this.props.logout();
     }

    return (
      <div>
        <button className="nav-item nav-link beast-login" onClick={onClickLogout.bind(this)}>Logout</button>
      </div>
    );
  }

}

/*================= mapStateToProps =================*/
function mapStateToProps( state){
  return { user: state.user };
}

export default connect(mapStateToProps, {logout})(Logout);
