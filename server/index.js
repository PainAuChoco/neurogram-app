const express = require('express');
var bodyParser = require('body-parser')
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs')
const { google } = require('googleapis');
const csvParser = require('csv-parser');
const isDev = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 5000;

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = 'token.json';
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../react-ui/build')));
app.use(express.static(path.join(__dirname, 'public')))

// Answer API requests.
app.get('/api', function (req, res) {
  res.set('Content-Type', 'application/json');
  res.send('{"message":"Hello from the custom server!"}');
});

app.get('/getPaintings', function (req,res) {
  console.log('get paintings')
  const filepath = './ids.csv'
  let dataList = []
  fs.createReadStream(filepath)
    .on('error', () => {
      console.error();
    })
    .pipe(csvParser())
    .on('data', (row) => {
        dataList.push(row)
    })
    .on('end', () => {
        console.log(dataList[0].id)
        dataList = shuffle(dataList)
        console.log(dataList[0].id)
        res.json(dataList.slice(0, 10000))
    })
})

app.get('/script/:id/:style/:number/:emotion', (req, res) => {
  let id = req.params.id
  let style = req.params.style
  let number = req.params.number
  let emotion = req.params.emotion

  console.log(style, emotion)

  let dataList = []
  // spawn new child process to call the python script
  const python = spawn("python", ["generator_64.py", style, emotion, number, 's', id]);
  // collect data from script
  python.stdout.on('data', function (data) {
    console.log('Pipe data from python script ...');
    dataList.push(uint8arrayToString(data))
  });
  //collect errors from script
  python.stderr.on('data', function (data) {
    console.error(data.toString());
  });
  // in close event we are sure that stream is from child process is closed
  python.on('close', (code) => {
    console.log(`child process close all stdio with code ${code}`);
    // send data to browser
    console.log(dataList)
    res.json(dataList)
  });
})

app.get('/register', (req, res) => {
  fs.readFile('./credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, th,en call the Google Drive API.
    //authorize(JSON.parse(content), uploadFile);
    var credentials = JSON.parse(content)
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
    authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('authurl ', authUrl)
    res.json(authUrl)
  });
})

app.post('/submit/:id', (req, res) => {
  let votes = req.body.votes
  let id = req.params.id
  let code = req.body.authCode
  let filename = 'votes_' + id + '.csv'

  console.log(code)

  let writeStream = fs.createWriteStream(filename)

  writeStream.on('finish', () => {
    fs.readFile('./credentials.json', (err, content) => {
      if (err) return console.log('Error loading client secret file:', err);
      var credentials = JSON.parse(content)
      const { client_secret, client_id, redirect_uris } = credentials.web;
      const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        uploadFile(oAuth2Client, filename)
      })
    })
  }).on('error', (err) => {
    console.log(err)
  })

  let newLine = []
  newLine.push("ID")
  newLine.push("Genre")
  newLine.push("Previous")
  newLine.push("New")
  writeStream.write(newLine.join(',') + '\n', () => { })

  votes.forEach(vote => {
    let newLine = []
    newLine.push(vote.id)
    newLine.push(vote.genre)
    newLine.push(vote.previous)
    newLine.push(vote.vote)
    writeStream.write(newLine.join(',') + '\n', () => { })
  })

  writeStream.end()
  res.sendStatus(200)

})

// All remaining requests return the React app, so it can handle routing.
/*app.get('*', function (request, response) {
  response.sendFile(path.resolve(__dirname, '../react-ui/build', 'index.html'));
});*/

app.listen(PORT, function () {
  console.error(`Node ${isDev ? 'dev server' : 'cluster worker ' + process.pid}: listening on port ${PORT}`);
});


function uploadFile(auth, filename) {
  console.log("uploadFile")
  const drive = google.drive({ version: 'v3', auth });

  drive.files.create({
    requestBody: {
      'name': filename,
      parents: ["1sDDrC0guO5ZhXklkLFZ4lF95ysG-NXCy"]
    },
    media: {
      mimeType: 'text/csv',
      body: fs.createReadStream(filename)
    },
    fields: 'id'
  }, (err, file) => {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      console.log('File Id: ', file.id);
    }
  });
}

// Function to convert an Uint8Array to a string
const uint8arrayToString = function(data){
  return String.fromCharCode.apply(null, data);
};

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
