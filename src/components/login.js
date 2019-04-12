import React, { Component } from 'react';
import { connect } from 'react-redux';
import {GoogleLogin} from 'react-google-login';

import { login } from './../redux/actions/actions';

class Login extends Component {

  render(){
/*======================================================*/
    const loginResponse = (res) => {
        if (res.error ){
            console.log("Login fail: "+res.error);
            console.log(res.w3)
            return;
        }

        let postData = {
            name: res.w3.ig,
            provider: 'google',
            email: res.w3.U3,
            provider_id: res.El,
            token: res.Zi.access_token,
            profile_pic: res.w3.Paa
        }

        this.props.login(postData); //add or retrieve user from our own DB
    } //end loginResponse

/*======================================================*/
    return (
      <div>
        <GoogleLogin className="beast-login"
                      clientId="57563421826-mk7jbki80g8e05ksjo5gjm1hrfltl7ui.apps.googleusercontent.com"
                      buttonText="Login"
                      icon={false}
                      onSuccess={loginResponse}
                      onFailure={loginResponse} />
      </div>

    );
  }
}

/*========================================================*/

export default connect(null, {login})(Login);
