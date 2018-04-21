
const ngrok = require('ngrok');
const colors = require('colors');
var https = require("https");

const ngrokInit = async (port) => {
    try {
        const url = await ngrok.connect(port);
        console.log(colors.green('ngrok is listening on port ' + port));
        return url;
    } catch (err) {
        throw new Error('Error starting ngrok.')
    }
}


// TODO: Handle expired access token condition
const updateAlexaEndpoint = async (ngrokPort, accessToken, config) => {

    try {
        const url = await ngrokInit(ngrokPort);

        try {
            skillManifest = await getSkillManifest(accessToken, config);
            console.log(colors.green('Skill Manifest fetched successfully'));
            await putSkillManifest(skillManifest, accessToken, url, config);
            console.log(colors.green('Alexa Skill Endpoint is updated with the url ==> '), colors.cyan(url));
        } catch (err) {
            console.log(colors.yellow('Error updating Alexa Skill Endpoint. You have to do it manually.\n'))
            console.log(colors.yellow('-----------------------------------------------------------------------------------------'));
            console.log(colors.yellow('| Enter this url as HTTPS endpoint in your Alexa console -->'), colors.cyan(url), colors.yellow(' |'));
            console.log(colors.yellow('-----------------------------------------------------------------------------------------\n'));
        }

    } catch (err) {
        throw new Error(err);
    }
}

const getSkillManifest = async (accessToken, config) => {
    let skillManifest = null;
    const skillId = config.skillId;
    const stage = config.stage;
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
    try {
        const response = await httpsGetRequest(options);
        if (response.statusCode == 200) {
            return response.body;
        } else {
            throw new Error(`Error fetching Skill Manifest. Response Status Code -> ${response.statusCode}`);
        }
    } catch (err) {
        throw new Error(err);
    }
}

const putSkillManifest = async (skillManifest, accessToken, url, config) => {
    const skillId = config.skillId;
    const stage = config.stage;

    skillManifest.manifest.apis.custom.endpoint.sslCertificateType = "Wildcard";
    skillManifest.manifest.apis.custom.endpoint.uri = url;

    const options = {
        host: 'api.amazonalexa.com',
        path: `/v1/skills/${skillId}/stages/${stage}/manifest`,
        method: 'PUT',
        headers: {
            'Authorization': accessToken,
            'Content-Type': 'application/json'
        }
    }

    try {
        response = await httpsPutRequest(options, skillManifest);
        if (response.statusCode != 202) {
            throw new Error(`Error fetching Skill Manifest. Response Status Code -> ${response.statusCode}`);
        }
    } catch (err) {
        throw new Error(err);
    }
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
            // throw new Error(`Error getting Skill Manifest`);
            reject(e);
        });

        req.end();

    })
}

const httpsPutRequest = (options, body) => {
    return new Promise((resolve, reject) => {
        const req = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (body) {
                resolve({ statusCode: res.statusCode })
            });
        });
        req.on('error', function (e) {
            // throw new Error(`Error updating Alexa Skill Endpoint`);
            reject(e);
        });
        // write data to request body
        req.write(JSON.stringify(body));
        req.end();
    })
}

module.exports = { updateAlexaEndpoint, ngrokInit };