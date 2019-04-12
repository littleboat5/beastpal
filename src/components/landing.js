import React, {Component} from 'react';
import { Link } from 'react-router-dom';

import './../styles/landing.css';


class Landing extends Component {

  render(){
    return (
      <div>
        <div id="landing-header">
         		<h1>Welcome to Beastpal!</h1>
            <Link className="btn btn-lg btn-success" to="/beasts">View All Beast of Burden</Link>
        </div>

        <ul className="slideshow">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    );
  }
}

export default Landing;
