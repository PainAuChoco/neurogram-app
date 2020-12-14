import '../App.css';
import React from "react";
import Button from "@material-ui/core/Button";
import ImageContainer from './ImageContainer';
import VotingButtons from './VotingButtons';
import { SemipolarLoading } from 'react-loadingg';
import $ from "jquery"

const GOOGLE_DRIVE_IMG_URL = "http://drive.google.com/uc?export=view&id=";

class EmotionPicker extends React.Component {


    state = {
        loading: true
    }

    componentDidMount() {
        console.log(this.props)
    }

    stopLoading = () => {
        this.setState({loading: false})
    }

    render() {
        return (
            <div>
                {this.state.loading &&
                    <SemipolarLoading className="loader" />
                }
                {this.props.paintings.length !== 0 &&
                    <React.Fragment>
                        <ImageContainer
                            url={GOOGLE_DRIVE_IMG_URL + this.props.paintings[0].id}
                            width={this.props.paintings[0].width}
                            height={this.props.paintings[0].height}
                            stopLoading={this.stopLoading}
                        />
                        {this.props.paintings[1] !== undefined &&
                            <div hidden>
                                <ImageContainer
                                    url={GOOGLE_DRIVE_IMG_URL + this.props.paintings[1].id}
                                    width={this.props.paintings[1].width}
                                    height={this.props.paintings[1].height}
                                    stopLoading={this.stopLoading}
                                />
                            </div>
                        }
                        {this.props.paintings.length < 10 &&
                            <div id="alert" className="mb-1">Warning: only {this.props.paintings.length - 2} artworks left to classify in this genre !</div>
                        }
                        {this.props.paintings.length >= 4 &&
                            <VotingButtons
                                callbackClick={this.props.handleVote}
                                windowWidth={this.props.windowWidth}
                                windowHeight={this.props.windowHeight}
                            />
                        }
                        <Button className='noOutline mt-1' variant='contained' color="secondary" onClick={this.props.nextPhoto}>I <span id="parenthesis"> don't know (and that's okay!)</span></Button>
                        {Object.entries(this.props.votes).length !== 0 &&
                            <Button id="submitBtn" className="noOutline" variant="contained" color="primary" value="Submit" onClick={this.props.submitVotes}>Submit {<span id="parenthesis">({this.props.votes.length} vote(s) so far)</span>}</Button>
                        }
                    </React.Fragment>
                }

            </div>
        )
    }
}

export default EmotionPicker;