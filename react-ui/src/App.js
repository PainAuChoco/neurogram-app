import './App.css';
import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageGenerator from "./Components/ImageGenerator"
import SuccessSnackBar from './Components/SuccessSnackBar'
import Menu from './Components/Menu'
import About from './Components/About'
import EmotionPicker from './Components/EmotionPicker';
import { ReactComponent as CurveArrow } from "./curve-arrow.svg"


const GOOGLE_API_KEY = "AIzaSyAcNznsnSs9fgpA47oE9EuTYflRSeH6RSc";
const GOOGLE_DRIVE_URL_START = "https://www.googleapis.com/drive/v2/files?q=%27";
const GOOGLE_DRIVE_URL_END = "%27+in+parents&maxResults=10000&key=";
const MAIN_FOLDER_ID = "11XVfzHUzqEStME89y-PgJZIOa-MlUODm"

class App extends React.Component {

  state = {
    votes: [],
    paintings: [],
    directories: [],
    positive: [],
    negative: [],
    neutral: [],
    currentWidth: 0,
    currentHeight: 0,
    loading: false,
    imgGenerated: false,
    display: null,
    driveSync: false,
    matchings: {},
    authCode: null,
    snackbarOpen: false,
    snackBarMessage: "",
    genUri: null,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight
  }

  componentDidMount() {
    if (this.state.authCode === null && window.location.href.includes("code")) {
      var temp = window.location.href.split("code=")
      var code = temp[1].split('&scope')[0]
      code = code.replace('%2F', '/')
      this.setState({
        authCode: code,
        display: "Emotion Picker",
        loading: true
      })
      //simply change url without redirection
      window.history.pushState({}, null, "/")
    }
    window.addEventListener('resize', this.updateDimensions);
    this.getPaintingsId()
  }

  updateDimensions = () => {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    })
  }

  componentDidUpdate() {
    if (this.state.display === "Emotion Picker" && this.state.authCode === null) {
      this.register()
    }
  }

  shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array
  }

  getPaintingsId = () => {
    fetch("/getPaintings")
      .then((res) => res.json())
      .then((jsonResp) => {
        var paintings = this.shuffleArray(jsonResp)
        this.setState({
          paintings: paintings,
          currentHeight: paintings[0].height,
          currentWidth: paintings[0].width,
        })
      })
  }

  handleVote = (vote) => {
    var photoTitle = this.state.paintings[0].title
    var genre = this.state.paintings[0].genre
    var votes = this.state.votes
    votes.push({
      id: photoTitle,
      genre: genre,
      previous: photoTitle.split('_')[1].split('.')[0],
      vote: vote.toLowerCase()
    })

    this.setState({
      votes: votes
    })
    this.nextPhoto()
  }

  nextPhoto = () => {
    var paintings = this.state.paintings
    paintings.splice(0, 1)

    var currentWidth = paintings[0].width
    var currentHeight = paintings[0].height

    this.setState({
      currentHeight: currentHeight,
      currentWidth: currentWidth
    })
  }

  handleReturnClick = () => {
    this.setState({
      paintings: []
    })
  }

  submitVotes = () => {
    var votes = this.state.votes
    var authCode = this.state.authCode
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ votes: votes, authCode: authCode })
    }

    fetch('/submit/' + Date.now().toString(), requestOptions)
      .then((res) => {
        if (res.ok) {
          this.setState({
            votes: [],
          })
          this.displaySuccessSnackbar('Your votes were successfuly submited ! Thank you for your participation')
        }
      })
      .catch(error => console.log(error))
  }

  getGeneratedImages = (style, imgNumber, emotion) => {
    var now = Date.now().toString()
    fetch('/script/' + now + '/' + style + '/' + imgNumber + '/' + emotion)
      .then((response) => { return response.json() })
      .then((res) => {
        var genUri = res.join('')
        this.setState({ genUri: genUri, imgGenerated: true })
      })
      .then((imgId) => {
        this.setState({ imgGenerated: true, imgId: imgId })
      })
  }

  displaySuccessSnackbar = (message) => {
    this.setState({
      snackbarOpen: true,
      snackBarMessage: message,
      snackaBarType: "success"
    })
  }

  displayErrorSnackBar = (message) => {
    this.setState({
      snackbarOpen: true,
      snackBarMessage: message,
      snackaBarType: "error"
    })
  }

  displayGenerator = () => {
    this.setState({ display: "Artwork Generator" })
  }

  displayEmotionPicker = () => {
    this.setState({ display: "Emotion Picker" })
  }

  displayAboutPage = () => {
    this.setState({ display: "About" })
  }

  displayHomePage = () => {
    this.setState({
      display: null
    })
  }

  register = () => {
    fetch("/register")
      .then((response) => { return response.json() })
      .then((res) => window.open(res, '_self'))
  }

  handleCloseError = () => {
    this.setState({
      snackbarOpen: false,
      snackBarMessage: ""
    })
  }

  render() {
    return (
      <div className="App">
        <div id="title">
          {this.state.display !== null &&
            <CurveArrow id="arrow" width="25px" height="25px" onClick={this.displayHomePage} />
          }
          {this.state.display !== null && this.state.display !== "About" &&
            <span> {this.state.display + " by "}</span>
          }
          {this.state.display === "About" &&
            <span>{this.state.display + ' '}</span>
          }
          <span id="neurogramTitle" onClick={this.displayHomePage}>Neurogram</span>
        </div>
        {this.state.display === null &&
          <Menu
            displayEmotionPicker={this.displayEmotionPicker}
            displayGenerator={this.displayGenerator}
            displayAboutPage={this.displayAboutPage}
            windowHeight={this.state.windowHeight}
            windowWidth={this.state.windowWidth}
          />
        }
        {this.state.display === "Artwork Generator" &&
          <div>
            <ImageGenerator
              show={this.state.imgGenerated}
              genUri={this.state.genUri}
              getGeneratedImages={this.getGeneratedImages}
              windowHeight={this.state.windowHeight}
              windowWidth={this.state.windowWidth}
              displayErrorSnackBar={this.displayErrorSnackBar}
            />
          </div>
        }
        {this.state.display === "Emotion Picker" &&
          <EmotionPicker
            submitVotes={this.submitVotes}
            handleVote={this.handleVote}
            nextPhoto={this.nextPhoto}
            paintings={this.state.paintings}
            loading={this.state.loading}
            votes={this.state.votes}
            currentWidth={this.state.currentWidth}
            currentHeight={this.state.currentHeight}
            windowHeight={this.state.windowHeight}
            windowWidth={this.state.windowWidth}
          />
        }
        {this.state.display === 'About' &&
          <About
            returnToMenu={this.displayHomePage}
            windowWidth={this.state.windowWidth}
            windowHeight={this.state.windowHeight}
          />
        }
        {this.state.snackbarOpen &&
          <SuccessSnackBar
            message={this.state.snackBarMessage}
            handleCloseError={this.handleCloseError}
            type={this.state.snackaBarType}
          />
        }
      </div>
    )
  }
}

export default App;
