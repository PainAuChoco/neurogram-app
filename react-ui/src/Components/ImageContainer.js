import '../App.css';
import React from "react";

class ImageContainer extends React.Component {

    state = {
        width: 0,
        height: 0,
        progress: 0
    }

    componentDidMount() {
        this.computeRatio()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.url !== this.props.url) {
            this.computeRatio()
        }
    }

    computeRatio = () => {
        var ratio = this.props.height / this.props.width
        console.log(ratio)
        var newWidth, newHeight
        if (ratio >= 1) {
            console.log("height bigger")
            newHeight = 300
            newWidth = newHeight / ratio
        }
        else {
            console.log("width bigger")
            newWidth = 300
            newHeight = newWidth * ratio
        }
        console.log(newWidth, newHeight)
        this.setState({
            width: newWidth,
            height: newHeight
        })
        this.props.stopLoading()
    }

    render() {
        return (
            <div id="currentPainting">
                <img
                    src={this.props.url}
                    width={this.state.width}
                    height={this.state.height}
                />
            </div>
        )
    }
}

export default ImageContainer;