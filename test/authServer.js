'use strict';
const expect = require('chai').expect;
const request = require('request');
const fs = require('fs');
const path = require('path')

const initAuthServer = require('./../authServer');

const indexHtml = fs.readFileSync(path.resolve(__dirname, './../html/index.html'), 'utf8');
const closeHtml = fs.readFileSync(path.resolve(__dirname, './../html/close.html'), 'utf8');

describe("Testing Login With Amazon Page", function () {
    let response = null;
    let body = null;
    let httpServer = null;
    before(function (done) {
        httpServer = initAuthServer();
        request('http://localhost:3001', function (error, resp, respBody) {
            response = resp;
            body = respBody
            done();
        });
    });


    describe("Testing response statuscode and body", function () {
        it('should render the page with index.html', function () {
            expect(body).to.equal(indexHtml);
        });

        it('should have status code 200', function () {
            expect(response.statusCode).to.equal(200);
        });
    })

    after(function () {
        httpServer.close();
    });

})

describe("Testing 'Successful Authentication and now you can close page'", function () {
    let response = null;
    let body = null;
    let httpServer = null;
    before(function (done) {
        httpServer = initAuthServer();
        request('http://localhost:3001/oauth2/callback?access_token=your_login_with_amazon_access_token', function (error, resp, respBody) {
            response = resp;
            body = respBody
            done();
        });
    });

    describe("Testing response statuscode and body", function () {
        it('should render the page with close.html', function () {
            expect(body).to.equal(closeHtml);
        });

        it('should have status code 200', function () {
            expect(response.statusCode).to.equal(200);
        });
    })

    after(function () {
        httpServer.close();
    });

})