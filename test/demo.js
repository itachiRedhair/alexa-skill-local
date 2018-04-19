'use strict';
const expect = require('chai').expect;

describe("Testing demo test", function () {

    it('should demo string be of type string', function () {
        expect('demo string').to.be.a('string')
    })

})