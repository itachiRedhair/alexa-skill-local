#!/usr/bin/env node

const express = require('express');
const bodyParser = require('body-parser')
const ngrok = require('ngrok');
const ArgumentParser = require('argparse').ArgumentParser;
const argParser = new ArgumentParser();
const path = require('path');
const colors = require('colors');

const app = express();
app.use(bodyParser.json());

argParser.addArgument(
    ['-f', '--file'],
    {
        help: 'lambda entry file'
    }
)

const args = argParser.parseArgs();

let filePath = args.file ? args.file : './index.js';
filePath = path.resolve(filePath);

console.log(filePath);
let index = null;
try {
    index = require(args.file);
} catch (err) {
    console.error(colors.red('lambda entry file not found'));
    console.log(err);
}

console.log(args);

ngrok.connect(3000).then(url => {
    console.log(colors.green('ngrok is listening on 3000'));
    console.log(colors.yellow(url));
});

app.post('/', (req, res) => {
    // Create dummy context with fail and succeed functions
    const context = {
        fail: () => res.sendStatus(500),
        succeed: data => res.send(data),
    };

    // Initialize alexa sdk
    index.handler(req.body, context);
});

app.listen(3000, function () {
    console.log('Alexa Local is running');
    console.log(colors.green('Express is running on port ' + '3000'))
});