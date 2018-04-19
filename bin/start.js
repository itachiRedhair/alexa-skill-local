#!/usr/bin/env node

const ArgumentParser = require('argparse').ArgumentParser;
const argParser = new ArgumentParser();
const path = require('path');
const colors = require('colors');
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

if (path.extname(filePath) === '.js') {
    filePath = path.dirname(filePath);
}

const port = args.port ? args.port : "3000";

console.log('in start.js file', 'filePath', filePath, 'port', port);

let handler;

const watchList = [
    filePath + '/'
];

const serverArgs = [filePath, port];

try {
    handler = require(filePath).handler;

    ngrokInit(port);

    nodemon({
        // nodeArgs: (process.env.REMOTE_DEBUG) ? ['--debug'] : [],
        script: __dirname + '/../server.js',
        args: serverArgs,
        watch: watchList,
        // env: {
        //     'DEBUG': (process.env.DEBUG) ? process.env.DEBUG : 'skill'
        // }
    });

} catch (err) {
    console.error(colors.red('lambda entry file not found'));
    console.log(err);
}