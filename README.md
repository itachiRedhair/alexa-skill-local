[![Build Status](https://travis-ci.org/itachiRedhair/alexa-skill-local.svg?branch=master)](https://travis-ci.org/itachiRedhair/alexa-skill-local)

[![Coverage Status](https://coveralls.io/repos/github/itachiRedhair/alexa-skill-local/badge.svg?branch=master)](https://coveralls.io/github/itachiRedhair/alexa-skill-local?branch=master)

# Update
Now working with ASK SDK v2.

# alexa-skill-local
`alexa-skill-local` provides you local development environment for your Alexa Skill. It starts ngrok and mock lambda server on the same port. All the traffic on this port is tunneled through ngrok. You have to login with Amazon to update your skill endpoint with the ngrok url. Mock lambda server calls your lambda function the each time it gets request from Alexa.

### Requirements
 - Node and npm
 - Alexa Skill (Lambda Code) written in Node.js

### Installation

Use [Node.js](https://nodejs.org/) v8.x.x to run.

You can install alexa-skill-local globally (recommended) or in your project directory (in this case you many want to run it from npm scripts in package.json).

```sh
$ npm install -g alexa-skill-local
```

### Usage

Run following command. When prompted open `http://localhost:3001` in your browser. Login with Amazon to grant `alexa-skill-local` an access to update your skill's endpoint.

```sh
$ alexa-skill-local [-f|--file <lambda_function_entry_file>] [-p|--port <server_and_ngrok_port>] [-c|--config <json_config_file>] [--inspect-brk <port>]
```
`--file` : Optional. When run without `--file` argument alexa-skill-local searches for main entry in `package.json`. If not found, it searches for `index.js` in the root directory.  

`--port`: Optional. Specify port value for mock lambda server and ngrok. Default value is 3000.  

`--config`: Optional. If not specified, it searches for `asl-config.json` in the root directory. You need to have config file, otherwise skill endpoint update won't work. Config file has to be of following format (If you are not sure of the "stage", in most cases it is "development"):  

```sh
{
    "skillId" : "your_skill_id_here",
    "stage" : "stage_of_the_skill"
}
```  

`--inspect-brk`: Optional. Specify this flag if you want to attach debugger to mock lambda server process. If port is not specified debugger will listen to is 9229.  


Then you can use your favorite editor to attach debugger to this process.  
For example in VSCode you will need following configuration in your launch.json file:  
```sh
{
    "type": "node",
    "request": "attach",
    "name": "alexa-skill-local",
    "processId": "${command:PickProcess}",
    "restart": true,
    "protocol": "inspector",
    "port": 9229
}
```  

License
----

MIT

Contact
----
email : akshay.milmile@gmail.com

Links
----
npm : https://www.npmjs.com/package/alexa-skill-local  
Privacy Policy : https://sites.google.com/view/alexa-skill-local

