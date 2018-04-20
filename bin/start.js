#!/usr/bin/env node
const colors = require('colors');
console.log(colors.magenta('alexa-skill-local is starting...'));
const ArgumentParser = require('argparse').ArgumentParser;
const argParser = new ArgumentParser();
const path = require('path');
const nodemon = require('nodemon');

const ngrokInit = require('./../ngrokController');

argParser.addArgument(
    ['-f', '--file'],
    {
        help: 'Specify lambda entry file. By default it will search for index.js file in the current directory'
    }
)

argParser.addArgument(
    ['-p', '--port'],
    {
        help: 'Specify port for express and ngrok setup. Default: 3000'
    }
)

const args = argParser.parseArgs();

let filePath = path.resolve(args.file ? args.file : './');

const watchList = [
    filePath
];

if (path.extname(filePath) === '.js') {
    let fileDirectory = path.dirname(filePath);
    watchList.push(fileDirectory);
} else {
    try {
        let packageJson = require(filePath + '/package.json');

        if (packageJson.main) {
            fileName = packageJson.main;
        } else {
            fileName = 'index.js';
            console.log(console.yellow('Main is not defined in package.json. Taking index.js as an entry point'));
        }

        filePath += '/' + fileName;
    } catch (err) {
        console.log(colors.yellow('package.json not found. Taking index.js as an entry point'));
        filePath += '/' + 'index.js';
    }
}

const port = args.port ? args.port : "3000";

let handler;



const serverArgs = [filePath, port];

try {
    handler = require(filePath).handler;

    ngrokInit(port);

    nodemon({
        script: __dirname + '/../server.js',
        args: serverArgs,
        watch: watchList
    });

    nodemon
        .on('quit', function () {
            console.log(colors.red('alexa-skill-local has stopped working.'));
            process.exit();
        }).on('restart', function (files) {
            console.log(colors.green('Restarting due to changes in files:'), files);
        });

} catch (err) {
    console.error(colors.red('lambda entry file not found'));
    console.log(err);
}