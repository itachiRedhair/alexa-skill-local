
const ngrok = require('ngrok');
const colors = require('colors');
var https = require("https");

const ngrokInit = async (port) => {
    const url = await ngrok.connect(port)
    console.log(colors.green('ngrok is listening on port ' + port));
    console.log(colors.yellow('-----------------------------------------------------------------------------------------'));
    console.log(colors.yellow('| Enter this url as HTTPS endpoint in your Alexa console -->'), colors.cyan(url), colors.yellow(' |'));
    console.log(colors.yellow('-----------------------------------------------------------------------------------------'));
    return url;
}

const updateAlexaEndpoint = async (ngrokPort, accessToken) => {
    const url = await ngrokInit(ngrokPort);
    skillManifest = await getSkillManifest(accessToken);
    await putSkillManifest(skillManifest, accessToken, url);
}

const getSkillManifest = async (accessToken) => {
    let skillManifest = null;
    const skillId = 'amzn1.ask.skill.d8ab4426-66ca-4dfd-bd0d-7f2c02419413';
    const stage = 'development';
    const options = {
        host: 'api.amazonalexa.com',
        path: `/v1/skills/${skillId}/stages/${stage}/manifest`,
        method: 'GET',
        headers: {
            'Authorization': accessToken
        }
    }
    // httpsRequest(options, (data, statusCode) => {
    //     skillManifest = data;
    // })
    response = await httpsGetRequest(options);
    return response.body;
}

const putSkillManifest = async (skillManifest, accessToken, url) => {
    const skillId = 'amzn1.ask.skill.d8ab4426-66ca-4dfd-bd0d-7f2c02419413';
    skillManifest.manifest.apis.custom.endpoint.sslCertificateType = "Wildcard";
    skillManifest.manifest.apis.custom.endpoint.uri = url;
    const stage = 'development';
    const options = {
        host: 'api.amazonalexa.com',
        path: `/v1/skills/${skillId}/stages/${stage}/manifest`,
        method: 'PUT',
        headers: {
            'Authorization': accessToken,
            'Content-Type': 'application/json'
        }
    }

    await httpsPutRequest(options, skillManifest);
}

const httpsGetRequest = (options) => {
    return new Promise((resolve, reject) => {

        const req = https.get(options, function (res) {

            const bodyChunks = [];
            res.on('data', function (chunk) {
                bodyChunks.push(chunk);
            }).on('end', function () {
                const body = Buffer.concat(bodyChunks);
                resolve({ body: JSON.parse(body), statusCode: res.statusCode })
            })
        });

        req.on('error', function (e) {
            console.log('ERROR: ' + e.message);
        });

        req.end();

    })
}

const httpsPutRequest = (options, body) => {
    return new Promise((resolve, reject) => {
        const req = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (body) {
                resolve();
            });
        });
        req.on('error', function (e) {
            console.log('in httpsPutRequest problem with request: ' + e.message);
        });
        // write data to request body
        req.write(JSON.stringify(body));
        req.end();
    })
}

module.exports = updateAlexaEndpoint;