import '../App.css';
import React from "react";
import Paper from "@material-ui/core/Paper"

import { ReactComponent as BrainSVG } from "../brain.svg"
import { ReactComponent as TeamSVG } from "../team.svg"
import { ReactComponent as IdeaSVG } from "../idea.svg"

class Menu extends React.Component{
    render(){
        return(
            <div className="d-flex">
              <div>
                
                <Paper className="mr-2" id="menuCard" elevation={5} onClick={this.props.displayGenerator} >
                  <BrainSVG className="mt-4" width="150" height="150" />
                </Paper>
                <span id="cardTitle">Generate original artworks</span>
                
              </div>
              <div>
                <Paper className="ml-2 mr-2" id="menuCard" elevation={5} onClick={this.props.displayEmotionPicker} >
                  <TeamSVG className="mt-4" width="150" height="150" />
                </Paper>
                <span id="cardTitle">Help us improve our AI</span>
              </div>
              <div>
                {/* 
                <Paper className="ml-2" id="menuCard" elevation={5} onClick={this.props.displayAboutPage} >
                  <IdeaSVG className="mt-4" width="150" height="150" />
                </Paper>
                <span id="cardTitle">Learn about Neurogram</span>
                */}
              </div>
            </div>
        )
    }
}

export default Menu;