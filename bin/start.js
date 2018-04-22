#!/usr/bin/env node
const colors = require('colors');
console.log(colors.magenta('alexa-skill-local is starting...'));
const ArgumentParser = require('argparse').ArgumentParser;
const argParser = new ArgumentParser();
const path = require('path');
const nodemon = require('nodemon');

const updateAlexaEndpoint = require('./../endpointController').updateAlexaEndpoint;
const ngrokInit = require('./../endpointController').ngrokInit;
const intiAuthServer = require('./../authServer');

argParser.addArgument(
    ['-f', '--file'],
    {
        help: 'Specify lambda entry file. By default it will search for index.js file in the current directory.'
    }
)

argParser.addArgument(
    ['-p', '--port'],
    {
        help: 'Specify port for express and ngrok setup. Default: 3000.'
    }
)

argParser.addArgument(
    '--inspect-brk',
    {
        help: 'Specify if you want to attach debugger.',
        action: 'store',
        nargs: '?',
        constant: 9229
    }
)

argParser.addArgument(
    ['-c', '--config'],
    {
        help: 'Required. Load you config file with skillId and stage.',
        defaultValue: 'asl-config.json'
        // required: true
    }
)

const httpsServer = intiAuthServer();

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
            console.log(colors.yellow('Taking ' + fileName + ' as an entry point from main field in package.json'));
        } else {
            fileName = 'index.js';
            console.log(colors.yellow('Main is not defined in package.json. Taking index.js as an entry point'));
        }

        filePath += '/' + fileName;
    } catch (err) {
        console.log(colors.yellow('package.json not found. Taking index.js as an entry point'));
        filePath += '/' + 'index.js';
    }
}

const port = args.port ? args.port : "3000";

const nodemonArgs = []

if (args.inspect_brk) {
    nodemonArgs.push(`--inspect-brk=${args.inspect_brk}`)
}

const serverArgs = [filePath, port];

httpsServer.on('access-token', async (accessToken) => {
    try {
        const config = require(path.resolve(args.config));

        try {
            await updateAlexaEndpoint(port, accessToken, config);
            initMockLambdaServer();
        } catch (err) {
            console.log(colors.red(err));
            console.log(colors.green('Only Mock Lambda Server will run in case you can deal with it somehow.'));
            initMockLambdaServer();
        }

    } catch (err) {
        console.log(colors.red('Error finding config file. Add asl-config.json file in root directory or specify JSON file path with --config argument .'));
        console.log(colors.yellow('Error updating Alexa Skill Endpoint. You have to do it manually.\n'))
        const url = await ngrokInit(port);
        console.log(colors.yellow('-----------------------------------------------------------------------------------------'));
        console.log(colors.yellow('| Enter this url as HTTPS endpoint in your Alexa console -->'), colors.cyan(url), colors.yellow(' |'));
        console.log(colors.yellow('-----------------------------------------------------------------------------------------\n'));
        initMockLambdaServer();
    }

});

function initMockLambdaServer() {
    try {
        const handler = require(filePath).handler;

        nodemon({
            nodeArgs: nodemonArgs,
            script: __dirname + '/../mockLambdaServer.js',
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
        console.error(colors.red('Error finding handler function in entry file.'));
        console.log(err);
    }
}