import './App.css';
import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageGenerator from "./Components/ImageGenerator"
import SuccessSnackBar from './Components/SuccessSnackBar'
import Menu from './Components/Menu'
import About from './Components/About'
import EmotionPicker from './Components/EmotionPicker';


const GOOGLE_API_KEY = "AIzaSyAcNznsnSs9fgpA47oE9EuTYflRSeH6RSc";
const GOOGLE_DRIVE_URL_START = "https://www.googleapis.com/drive/v2/files?q=%27";
const GOOGLE_DRIVE_URL_END = "%27+in+parents&maxResults=1000&key=";
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
    genUri: null
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
      this.loadDirectoriesName()
    }
  }

  componentDidUpdate() {
    if (this.state.positive.length !== 0 && this.state.negative.length !== 0 && this.state.neutral.length !== 0) {
      var paintings = this.state.paintings
      paintings = paintings.concat(this.state.negative)
      paintings = paintings.concat(this.state.positive)
      paintings = paintings.concat(this.state.neutral)
      console.log(paintings.length)

      paintings = this.shuffleArray(paintings)
      paintings = this.removeEdited(paintings)
      var currentWidth = paintings[0].imageMediaMetadata.width
      var currentHeight = paintings[0].imageMediaMetadata.height
      this.setState({
        paintings: paintings,
        positive: [],
        negative: [],
        neutral: [],
        currentHeight: currentHeight,
        currentWidth: currentWidth,
      })
    }

    if (this.state.display === "Emotion Picker" && this.state.authCode === null) {
      this.register()
    }
  }

  loadDirectoriesName = () => {
    fetch(
      GOOGLE_DRIVE_URL_START +
      MAIN_FOLDER_ID +
      GOOGLE_DRIVE_URL_END +
      GOOGLE_API_KEY
    )
      .then(response => response.json())
      .then(jsonResp => {
        var dirs = jsonResp.items
        this.setState({
          directories: dirs,
          loading: true
        })
        return dirs
      })
      .then((dirs) => {
        dirs.forEach(dir => {
          var dirId = dir.id
          switch (dir.title) {
            case 'portrait':
            case 'landscape':
            case 'asbtract':
            case 'animal-painting':
            case 'cityscape':
            case 'flower':
              this.loadSubDir(dirId);
              break;
          }
          //this.loadSubDir(dirId)
        });
      })
      .then(() => {
        this.setState({ driveSync: true, loading: false })
      })
  }

  removeEdited = (paintings) => {
    for (var i = 0; i < paintings.length; i++) {
      if (paintings[i].title.includes("edited")) {
        paintings.splice(i, 1)
      }
    }
    return paintings
  }

  loadSubDir = (dirId) => {
    fetch(
      GOOGLE_DRIVE_URL_START +
      dirId +
      GOOGLE_DRIVE_URL_END +
      GOOGLE_API_KEY
    )
      .then(response => response.json())
      .then(jsonResp => {
        jsonResp.items.forEach((subdir) => {
          this.state.matchings[subdir.id] = subdir.parents[0].id
          this.loadData(subdir.id, subdir.title)
        })
      })
  }

  loadData = (dirId, type) => {
    fetch(
      GOOGLE_DRIVE_URL_START +
      dirId +
      GOOGLE_DRIVE_URL_END +
      GOOGLE_API_KEY
    )
      .then(response => response.json())
      .then(jsonResp => {
        var data = jsonResp.items
        switch (type) {
          case "positive":
            {
              this.setState({
                positive: data
              })
              break;
            }
          case "neutral":
            {
              this.setState({
                neutral: data
              })
              break;
            }
          case "negative":
            {
              this.setState({
                negative: data
              })
              break;
            }
        }
      })
      .catch(error => console.log(error))
  }

  handleVote = (vote) => {
    var photoTitle = this.state.paintings[0].title
    var type = this.findDirectoryNameById(this.state.paintings[0].parents[0].id)
    var votes = this.state.votes
    votes.push({
      id: photoTitle,
      type: type,
      previous: photoTitle.split('_')[1].split('.')[0],
      vote: vote.toLowerCase()
    })

    this.setState({
      votes: votes
    })
    this.nextPhoto()
  }

  findDirectoryNameById = (id) => {
    var res
    this.state.directories.forEach(dir => {
      if (dir.id === this.state.matchings[id]) {
        res = dir.title
      }
    });
    return res
  }

  nextPhoto = () => {
    var paintings = this.state.paintings
    paintings.splice(0, 1)

    var currentWidth = paintings[0].imageMediaMetadata.width
    var currentHeight = paintings[0].imageMediaMetadata.height

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

  shuffleArray = (array) => {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array
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
      snackBarMessage: message
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
        <header className="App-header">
          <div id="title">
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
            />
          }
          {this.state.display === "Artwork Generator" &&
            <div>
              <ImageGenerator
                show={this.state.imgGenerated}
                genUri={this.state.genUri}
                getGeneratedImages={this.getGeneratedImages}
              />
            </div>
          }
          {this.state.display === "Emotion Picker" &&
            <EmotionPicker
              submitVotes={this.submitVotes}
              handleVote={this.handleVote}
              paintings={this.state.paintings}
              loading={this.state.loading}
              votes={this.state.votes}
              currentWidth={this.state.currentWidth}
              currentHeight={this.state.currentHeight}
            />
          }
          {this.state.display === 'About' && 
            <About
              returnToMenu={this.displayHomePage}
            />
          }
          {this.state.snackbarOpen &&
            <SuccessSnackBar
              message={this.state.snackBarMessage}
              handleCloseError={this.handleCloseError}
            />
          }
        </header>
      </div >
    )
  }
}

export default App;
