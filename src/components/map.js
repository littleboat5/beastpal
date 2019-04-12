/*global google*/

/* without the above line, component will NOT render with error: "google not
defined no-def" error!!
*/

import React, {Component} from 'react';

class GoogleMap extends Component {
  constructor(){
    super();
    this.state = {
      hidden: "hidden"
    }
  }
/* ================================================*/
  componentDidMount(){
/* the map API takes time to run, need to wait couple seconds before showing the map,
otherwise it may show the previous map
*/
    setTimeout( ()=> { this.setState({hidden : ""}); }, this.props.wait);
  }
/* ================================================*/
  shouldComponentUpdate(props, state){
/* this funciton works with componentDidUpdate. Props here are next props values.
If they are undefined, return false, which will forbid componentDidUpdate to run
*/
// console.log('should'+props.location+","+props.lat+","+props.lng)
    if ( props.lat && props.lng)
      return true;
    else
      return false;
  }
/* ================================================*/
  componentDidUpdate(props, state, snapshot){
// console.log('componentDidUpdate'+props.location+","+props.lat+","+props.lng)

/* in componentDidUpdate props holds previous props values so the coord may belongs
to the previous beast. If the google map API is called with the prev coord,
it may cause this error: Cannot read property 'firstChild' of undefined.
Solution: check for the "next" props values in shouldComponentUpdate
*/
    if( props.lat && props.lng) {
      new google.maps.Map (
        this.refs.map, // tell google map where to place the map
        { zoom:8,
          center:{lat:props.lat, lng:props.lng}
        }
      );
    };
  }
/* ================================================*/
  render(){
    if( this.props.lat && this.props.lng) {

      return <div id='googlemap' ref='map' className={this.state.hidden}/>;
    // use "ref" so other places can reference to this div tag by
    // this.refs.map
    }
    else {
      return <div className='text-danger'>Not able to render map with the given location</div>
    }
  }
}

export default GoogleMap;
