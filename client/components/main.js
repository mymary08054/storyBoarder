import React, { Component } from 'react'
import { ReactFireMixin } from 'reactfire'
import firebaseApp from '../../fire'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { logout } from '../store'
import { SketchPicker } from 'react-color';

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
      currentColor: "#fff",
      textCards: [],
      connections: {} //adjacency list of connections
    }
    // this.mixins = [ReactFireMixin]
    this.ref = firebaseApp.database().ref("users").child("u1");
  }

  componentDidMount() {
    this.ref.on('value', (snapshot) => { //async!!
      this.setState({ textCards: snapshot.val().textCards }) //async !!!
      console.log("MY STATE", this.state)
      this.connect(this.state.textCards);
    })
  }

  AddCard = (evt) => {
    evt.preventDefault();
    const newTextCards = [...this.state.textCards, { id: this.state.textCards.length, text: "", hex: this.state.currentColor }];
    this.setState({ textCards: newTextCards })
    this.ref.update({ "textCards": newTextCards })
  }

  addBgColorStyle = (rgb) => {
    return { backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, .5)` }
  }

  handleChangeComplete = (color) => {
    // console.log("COLOR", color.rg)
    this.setState({ currentColor: color.hex });
  };

  render() {
    const { children, handleClick, isLoggedIn } = this.props

    return (
      <div>
        {/* Create card Button */}
        <SketchPicker color={this.state.currentColor} onChangeComplete={this.handleChangeComplete} />
        <form id="add-card-btn" onSubmit={this.AddCard}>
          <div className="input-group input-group-lg">
            <button type="submit" className="btn btn-default">Add Card</button>
          </div>
        </form>

        {/* Create cards on state */}
        <div id="diagramContainer" className="drag-drop-canvas">
          {
            this.state && this.state.textCards.map((textCard) => (
              <div id={`item_${textCard.id}`} key={textCard.id} className="item"
                style={this.addBgColorStyle(this.hexToRgb(textCard.hex))}>
                <textarea rows="5" id="comment" className="textCard" >{textCard.text}</textarea>
              </div>
            ))
          }
        </div>
      </div>
    )
  }

  hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  //debug: adding space to make cards easier to read
  //returns obj with marginLeft
  addSpacingStyle = (ind) => {
    return { marginLeft: `${ind * 100}px` }
  }

  //TODO: need to find best place to place this, connect & this
  // method are way too expensive rn
  createAnchorStyle = (anchorDirection) => {
    return {
      /* Endpoint-Style */
      endpoint: "Circle",
      paintStyle: { fillStyle: card.hex, outlineColor: card.hex },
      hoverPaintStyle: { fillStyle: card.hex },

      /* Connector(Line)-Style */
      connectorStyle: { strokeStyle: card.hex },
      connectorHoverStyle: { lineWidth: 8 },
      anchor: [anchorDirection]
    }
  }


  connect = (cards) => {
    // console.log("IM CONNECTING")
    // create own component?
    jsPlumb.ready(function () {
      //TODO: not recognized as func?
      // jsPlumb.setContainer("diagramContainer");

      //create all connectors
      var common = {
        isSource: true,
        isTarget: true,
        connector: ["Bezier"]
      };

      cards.forEach((card) => {
        const item_id = `item_${card.id}`;
        jsPlumb.addEndpoint(item_id, {
          /* Endpoint-Style */
          endpoint: "Rectangle",
          paintStyle: { fillStyle: card.hex, outlineColor: card.hex },
          hoverPaintStyle: { fillStyle: card.hex },

          /* Connector(Line)-Style */
          connectorStyle: { strokeStyle: card.hex },
          connectorHoverStyle: { lineWidth: 8 },
          anchor: ["Right"]
        }, common);
        jsPlumb.addEndpoint(item_id, {
          endpoint: "Rectangle",
          paintStyle: { fillStyle: card.hex, outlineColor: card.hex },
          hoverPaintStyle: { fillStyle: card.hex },
          /* Connector(Line)-Style */
          connectorStyle: { strokeStyle: card.hex },
          connectorHoverStyle: { lineWidth: 8 },
          anchor: "Left"
        }, common);
        jsPlumb.addEndpoint(item_id, {
          endpoint: "Rectangle",
          paintStyle: { fillStyle: card.hex, outlineColor: card.hex },
          hoverPaintStyle: { fillStyle: card.hex },
          /* Connector(Line)-Style */
          connectorStyle: { strokeStyle: card.hex },
          connectorHoverStyle: { lineWidth: 8 },
          anchor: "Top"
        }, common);
        jsPlumb.addEndpoint(item_id, {
          endpoint: "Rectangle",
          paintStyle: { fillStyle: card.hex, outlineColor: card.hex },
          hoverPaintStyle: { fillStyle: card.hex },
          /* Connector(Line)-Style */
          connectorStyle: { strokeStyle: card.hex },
          connectorHoverStyle: { lineWidth: 8 },

          anchor: "Bottom"
        }, common);

        $("#" + item_id).resizable({
          resize: function (event, ui) {
            jsPlumb.repaint(ui.helper);
          },
          handles: "all"
        });

      })

      //connect related cards loaded from store
      // jsPlumb.connect({
      //   source: "item_0",
      //   target: "item_right",
      //   endpoint: "Rectangle"
      // });

      jsPlumb.draggable(jsPlumb.getSelector(".drag-drop-canvas .item"));
    });
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
