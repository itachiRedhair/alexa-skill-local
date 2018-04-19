#!/usr/bin / env node

const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const colors = require('colors');


const server = express();
server.use(bodyParser.json());


const filePath = process.argv[2];
const port = process.argv[3];
console.log('process argv=>', JSON.stringify(process.argv))
// console.log('in server.js file', 'filePath', filePath, 'port', port);

const handler = require(filePath).handler;


server.post('/', (req, res) => {
    // Create dummy context with fail and succeed functions
    const context = {
        fail: () => res.sendStatus(500),
        succeed: data => res.send(data),
    };

    // Initialize alexa sdk
    handler(req.body, context);
});

server.listen(port , function () {
    console.log('Alexa Local is running');
    console.log(colors.green('Express is running on port ' + port))
});