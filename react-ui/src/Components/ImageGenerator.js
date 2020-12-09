import '../App.css';
import React from "react";
import Button from "@material-ui/core/Button"
import { SemipolarLoading } from 'react-loadingg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCloudDownloadAlt, faPalette } from "@fortawesome/free-solid-svg-icons";
import $ from "jquery"

library.add(faCloudDownloadAlt, faPalette)

const generatorBig = {
    width: "600px"
}

const generatorSmall = {
    width: "400px",
    fontSize: "small",
    marginTop: "6em"
}


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
        var style = $('#style').val()
        var number = $('#number').val()
        var emotion = $('#emotion').val()
        if (style === null || number === null || emotion === null) {
            this.props.displayErrorSnackBar("Please select a painting style, an emotion and a number of images to generate !")
        } else {
            this.props.getGeneratedImages(style, number, emotion)
            this.setState({ loading: true })
        }
    }

    render() {
        return (
            <div id="generator" style={this.props.windowWidth > 650 ? generatorBig : generatorSmall}>
                <div id="introText">
                    <p>
                        This is the very first generator of Neurogram !
                    </p>
                    <p hidden>
                        As you may have noticed, you are not wearing an electrode-filled helmet capturing your brain activity.
                        Therefore, we'll have to trust you on this one and let you tell us what kind of emotion you would like to recognize in the generated artwork !
                    </p>
                    <p>
                        Please be indulgent with our 64x64 pixels creations, it's only the beginning !
                    </p>
                </div>
                <div id="form">

                    <select id="style" name="style" className="select form-control mr-1" placeholder="Painting Style">
                        <option value="" disabled selected hidden>Painting Style</option>
                        <option value="portrait">Portrait</option>
                        <option value="abstract">Abstract</option>
                        <option value="flower-painting">Flower</option>
                        <option value="landscape">Landscape</option>
                    </select>

                    <select id="emotion" name="emotion" className="select form-control" placeholder="Emotion Type">
                        <option value="" disabled selected hidden>Emotion Type</option>
                        <option value="positive">positive</option>
                        <option value="negative">negative</option>
                        <option value="neutral">neutral</option>
                    </select>

                    <select id="number" name="number" className="select form-control ml-1" placeholder="Number of generation">
                        <option value="" disabled selected hidden>Number of Images</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="8">8</option>
                        <option value="16">16</option>
                        <option value="64">64</option>
                        <option value="128">128</option>
                    </select>
                </div>
                <Button variant="contained" className="noOutline mt-1" onClick={this.handleGenerateClick} color="primary">
                    Generate
                    <FontAwesomeIcon className="ml-2" icon="palette" />
                </Button>
                {!this.state.loading && this.props.genUri !== null &&
                    <Button id="downloadbtn" download href={this.props.genUri} className="noOutline ml-1 mt-1" variant="contained" color="primary">
                        Download
                        <FontAwesomeIcon className="ml-2" icon="cloud-download-alt" />
                    </Button>
                }
                <div>
                    {this.state.loading &&
                        <SemipolarLoading style={{ position: "relative", margin: "auto", marginTop: "1em" }} />
                    }
                    {this.props.genUri !== null &&
                        <React.Fragment>
                            <img className='mt-3'
                                style={{ maxWidth: this.props.windowWidth + "px" }}
                                src={this.props.genUri}
                            />
                        </React.Fragment>
                    }
                </div>
            </div >
        )
    }
}

export default ImageGenerator;