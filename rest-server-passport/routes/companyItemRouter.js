var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Model = require('../models/companyItems');
var Verify = require('./verify');

var router = express.Router();
router.use(bodyParser.json());

router.route('/')
.all(Verify.verifyOrdinaryUser)
.get(function (req, res, next) {
    Model.find({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
})

.post(function (req, res, next) {
    Model.create(req.body, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
})

.delete(function (req, res, next) {
    Model.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

router.route('/:theId')
.all(Verify.verifyOrdinaryUser)
.get(function (req, res, next) {
    Model.findById(req.params.theId, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
})

.put(function (req, res, next) {
    Model.findByIdAndUpdate(req.params.theId, {
        $set: req.body
    }, {
        new: true
    }, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
})

.delete(function (req, res, next) {
    Model.findByIdAndRemove(req.params.theId, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

module.exports = router;
