import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from './login';
import Logout from './logout';

class Header extends Component {

  render() {

    function renderProfile(user) {
      return (
        <div className='user-profile'>
          <img className="avatar-image" height="40" width="40" src={user.profile_pic} alt={user.name}/>
          <div className='user-profile-name'>
            <div>
              <small>{user.name}</small>
            </div>
            <small>{user.email}</small>
          </div>
        </div>
      );
    }

    return (
      <div id="header-nav-bar">
        <nav className="navbar navbar-expand-lg navbar-dark" >
    {/*Yak icon*/}
          <Link className="navbar-brand" to="/">
            <img className="icon-brand" src="/assets/favicon.ico" alt="beastpal"/>
          </Link>
          <button type="button" className="navbar-toggler" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
              <span className="navbar-toggler-icon"></span>
          </button>

          <div id="navbar" className="collapse navbar-collapse">
              <ul className="nav navbar-nav navbar-right">
      {/*View all beasts*/}
                <li className="nav-item">
                  <Link className="nav-item nav-link " to="/beasts">View Beasts</Link>
                </li>
      {/*Add new beast*/}
                <li className="nav-item">
                  <Link className={this.props.user.isAuth ? "nav-link":"nav-link disabled"}
                    to={this.props.user.isAuth ? "/beasts/new":"#"}>Register Beast</Link>
                </li>
      {/*Login/Logout*/}
                <li className="nav-item">
                  {this.props.user.isAuth ? <Logout /> : <Login />}
                </li>
      {/*User info*/}
                <li  className="nav-item" >
                  {this.props.user.isAuth ? renderProfile(this.props.user.user) : ""}
                </li>
              </ul>
          </div>
        </nav>
      </div>
    ); //end return
  }// end render

}

/*================= mapStateToProps =================*/
function mapStateToProps( state){
  return { user: state.user };
}

export default connect(mapStateToProps)(Header);
