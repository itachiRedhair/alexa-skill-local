const ngrok = require('ngrok');
const colors = require('colors');

const ngrokInit = (port) => {

    ngrok.connect(port).then(url => {
        console.log(colors.green('ngrok is listening on port ' + port));
        console.log(colors.yellow('Enter this url as HTTPS endpoint in your Alexa console', url));
    }).catch(err => {
        console.error(colors.red('Some error occured while initializing ngrok'));
    });

}

module.exports = ngrokInit;