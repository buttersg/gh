var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Item = require('../models/items');
var Verify = require('./verify');

var itemRouter = express.Router();
itemRouter.use(bodyParser.json());

itemRouter.route('/')
.all(Verify.verifyOrdinaryUser)
.get(function (req, res, next) {
    Item.find({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
})

.post(function (req, res, next) {
    Item.create(req.body, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
})

.delete(function (req, res, next) {
    Item.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

itemRouter.route('/:itemId')
.all(Verify.verifyOrdinaryUser)
.get(function (req, res, next) {
    Item.findById(req.params.itemId, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
})

.put(function (req, res, next) {
    Item.findByIdAndUpdate(req.params.itemId, {
        $set: req.body
    }, {
        new: true
    }, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
})

.delete(function (req, res, next) {
    Item.findByIdAndRemove(req.params.itemId, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

module.exports = itemRouter;
