import '../App.css';
import React from "react";
import Paper from "@material-ui/core/Paper"

import { ReactComponent as BrainSVG } from "../brain.svg"
import { ReactComponent as TeamSVG } from "../team.svg"
import { ReactComponent as IdeaSVG } from "../idea.svg"

const horizontalDisplayCard = {
  width: "200px", 
  height: '200px'
}

const horizontalDisplaySVG = {
  width: "150px", 
  height: '150px'
}

const verticalDisplayCard = {
  width: "160px", 
  height: '160px'
}

const verticalDisplaySVG = {
  width: "120px", 
  height: '120px'
}

class Menu extends React.Component {

  state = {
    hover: '',
  }
  
  render() {
    return (
      <div className={this.props.windowWidth > 650 ? "d-flex" : "d-flex flex-column"}>
        <div>
          <Paper className="mr-2" id="menuCard" style={this.props.windowWidth > 650 ? horizontalDisplayCard : verticalDisplayCard}
            elevation={this.state.hover === 'generate' ? 24 : 1}
            onClick={this.props.displayGenerator}
            onMouseEnter={() => this.setState({ hover: 'generate' })}
            onMouseLeave={() => this.setState({ hover: '' })}
          >
            <BrainSVG className="mt-4" style={this.props.windowWidth > 650 ? horizontalDisplaySVG : verticalDisplaySVG} />
          </Paper>
          <span id="cardTitle">Generate original artworks</span>
        </div>
        <div>
          <Paper className="ml-2 mr-2" id="menuCard" style={this.props.windowWidth > 650 ? horizontalDisplayCard : verticalDisplayCard}
            elevation={this.state.hover === 'pick' ? 24 : 1}
            onClick={this.props.displayEmotionPicker}
            onMouseEnter={() => this.setState({ hover: 'pick' })}
            onMouseLeave={() => this.setState({ hover: '' })}
          >
            <TeamSVG className="mt-4" style={this.props.windowWidth > 650 ? horizontalDisplaySVG : verticalDisplaySVG}/>
          </Paper>
          <span id="cardTitle">Help us improve our AI</span>
        </div>
        <div>
          <Paper className="ml-2" id="menuCard" style={this.props.windowWidth > 650 ? horizontalDisplayCard : verticalDisplayCard}
            elevation={this.state.hover === 'about' ? 24 : 1}
            onClick={this.props.displayAboutPage}
            onMouseEnter={() => this.setState({ hover: 'about' })}
            onMouseLeave={() => this.setState({ hover: '' })}
          >
            <IdeaSVG className="mt-4" style={this.props.windowWidth > 650 ? horizontalDisplaySVG : verticalDisplaySVG} />
          </Paper>
          <span id="cardTitle">Learn about Neurogram</span>
        </div>
      </div>
    )
  }
}

export default Menu;