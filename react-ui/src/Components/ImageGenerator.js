import '../App.css';
import React from "react";
import Button from "@material-ui/core/Button"
import $ from "jquery"

class ImageGenerator extends React.Component {

    state = {
        style: "portrait",
        emotion: "positive",
        number: 1,
        loading: false
    }

    componentDidUpdate(prevProps) {
        if (prevProps.genUri !== this.props.genUri) {
            this.setState({ loading: false })
        }
    }

    handleGenerateClick = () => {
        this.setState({ loading: true })
        var style = $('#style').val()
        var number = $('#number').val()
        var emotion = $('#emotion').val()

        this.props.getGeneratedImages(style, number, emotion)
    }


    render() {
        return (
            <div id="generator">
                <div id="introText">
                    <p>
                        This is the very first generator of Neurogram !
                    </p>
                    <p>
                        As you may have noticed, you are not wearing an electrode-filled helmet capturing your brain activity.
                        Therefore, we'll have to trust you on this one and let you tell us what kind of emotion you would like to recognize in the generated artwork !
                    </p>
                    <p>
                        Please be indulgent with our 64x64 pixels creations, it's only the beginning !
                    </p>
                </div>
                <div id="form">
                    
                    <select id="style" name="style" className="select form-control mr-1" placeholder="Painting Style">
                        <option value="portrait">Portrait</option>
                        <option value="abstract">Abstract</option>
                        <option value="flower-painting">Flower</option>
                        <option value="landscape">Landscape</option>
                    </select>

                    <select id="emotion" name="emotion" className="select form-control" placeholder="Emotion Type">
                        <option value="positive">positive</option>
                        <option value="negative">negative</option>
                        <option value="neutral">neutral</option>
                    </select>

                    <select id="number" name="number" className="select form-control ml-1" placeholder="Number of generation">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="8">8</option>
                        <option value="16">16</option>
                        <option value="64">64</option>
                        <option value="128">128</option>
                    </select>
                </div>
                <Button variant="contained" className="noOutline mt-1 ml-1" onClick={this.handleGenerateClick} color="primary">Generate Image</Button>
                <div>
                    {this.state.loading &&
                        <div className="spinner-border mt-2" role="status"></div>
                    }
                    {this.props.genUri !== null &&
                        <React.Fragment>
                            <img className='mt-3' src={this.props.genUri} />
                        </React.Fragment>
                    }
                </div>
            </div >
        )
    }
}

export default ImageGenerator;