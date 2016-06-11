var request = require('supertest');
var assert = require('assert');

var SERVER = 'http://localhost:3000';

describe('GET /users', function () {

    var ordinaryToken = '',
        adminToken = '';

    beforeEach(function () {
        request(SERVER)
        .post('/users/login')
        .send({ username: 'sylvain', password: 'password' })
        .end(function (err, res) {
            ordinaryToken = res.body.token;
        });

        request(SERVER)
        .post('/users/login')
        .send({ username: 'admin', password: 'password' })
        .end(function (err, res) {
            adminToken = res.body.token;
        });
    });


    /*it("Setting up tokens... please wait", function (done) {
        setTimeout(function () {
            done();
        }, 1000);
    });*/


    it('Responds with 401 Forbidden if token is not an admin', function (done) {
        request(SERVER)
        .get('/users')
        .set('Accept', 'application/json')
        .set('x-access-token', ordinaryToken)
        .expect('Content-Type', /json/)
        .expect(function (res) {
            assert.equal(res.body.message, 'You are not an admin!');
        })
        .expect(401)
        .end(done);
    });

    it('Responds with 200 OK if token is admin', function (done) {
        request(SERVER)
        .get('/users')
        .set('Accept', 'application/json')
        .set('x-access-token', adminToken)
        .expect('Content-Type', /json/)
        .expect(function (res) {
            // assuming you only have 2 data samples
            assert.equal(2, res.body.length);
        })
        .expect(200)
        .end(done);
    });


});
