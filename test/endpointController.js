'use strict';
const expect = require('chai').expect;
const request = require('request');
const ngrok = require('ngrok');

const ngrokInit = require('./../endpointController').ngrokInit;

describe("Testing ngrokInit function", function () {
    let url = '';
    this.timeout(7000);
    
    before(async function () {
        url = await ngrokInit(3000);
    });

    after(async function () {
        await ngrok.kill();
    });

    it('should generate ngrok url', function () {
        expect(url).to.contain('ngrok');
    });
});