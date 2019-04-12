import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

export default function (Compon) {

    class Authenticate extends Component {

        componentWillMount() {
            if (!this.props.isAuth) {
                this.context.router.history.push('/beasts');
            }
        }

        render() {
          return( <Compon {...this.props} />);
        }
    } // end class Authenticate

    Authenticate.contextTypes = {
        router: PropTypes.object.isRequired
    }

    const mapStateToProps = state => {
        return {
            isAuth: state.user.isAuth
        }
    }

    return connect(mapStateToProps)(Authenticate);
}
