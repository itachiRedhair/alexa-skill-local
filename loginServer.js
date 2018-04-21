const express = require('express');
const http = require('http');
const bodyParser = require('body-parser')
const app = express();
const nodemon = require('nodemon');

let accessToken = null;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/loginPage'));

app.get('/oauth2/callback', function (req, res) {
    accessToken = req.query.access_token;
    res.sendFile(__dirname + '/loginPage/close.html');
    httpServer.close();
    httpServer.emit('access-token', accessToken);
});

const httpServer = http.createServer(app);

module.exports = function initLoginServer() {
    httpServer.listen(3001, () => {
        console.log('Open in your browser and login with Amazon ==> http://localhost:3001')
    });
    return httpServer;
}
