import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { logout } from '../store'

/**
 * COMPONENT
 *  The Main component is our 'picture frame' - it displays the navbar and anything
 *  else common to our entire app. The 'picture' inside the frame is the space
 *  rendered out by the component's `children`.
 */
class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      textCards: [{ text: "one" }, { text: "two" }, { text: "three" }]
    }
  }

  componentDidMount() {
  }

  connect() {
    // create own component?
    jsPlumb.ready(function () {
      jsPlumb.connect({
        source: "item_left",
        target: "item_right",
        endpoint: "Rectangle"
      });
      jsPlumb.draggable(jsPlumb.getSelector(".drag-drop-canvas .item"));

    });
  }

  render() {
    const { children, handleClick, isLoggedIn } = this.props

    const divStyle = {
      marginLeft: "50px"
    }

    return (
      <div>
        {/* Create card Button */}

        {/* Create cards on state */}
        <div id="diagramContainer" className="drag-drop-canvas">
          {this.connect()}
          {
            this.state && this.state.textCards.map((textCard) => (
              <div id="item_left" key={textCard.text} className="item">
                <textarea rows="5" id="comment" className="textCard" >{textCard.text}</textarea>
              </div>
            ))
          }
          <div id="item_right" className="item">
            <textarea rows="5" id="comment" className="textCard" >RIGHT</textarea>
          </div>
        </div>

        <h1>BOILERMAKER</h1>
        <nav>
          {
            isLoggedIn
              ? <div>
                {/* The navbar will show these links after you log in */}
                <Link to='/home'>Home</Link>
                <a href='#' onClick={handleClick}>Logout</a>
              </div>
              : <div>
                {/* The navbar will show these links before you log in */}
                <Link to='/login'>Login</Link>
                <Link to='/signup'>Sign Up</Link>
              </div>
          }
        </nav>
        <hr />
        {children}
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = (dispatch) => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Main))

/**
 * PROP TYPES
 */
Main.propTypes = {
  children: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
