var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Stores = require('../models/stores');
var Item = require('../models/items');
var CompanyItems = require('../models/companyItems');
var Verify = require('./verify');

var router = express.Router();
router.use(bodyParser.json());

router.route('/:postal/item/:item')
.get(function (req, res, next) {
    // first look for items using text search based on the name passed in
    Item
        .find(
            { $text: { $search: req.params.item } }
        )
        .select('_id')
        .exec(function (err, itemIds) {
            // callback
            if (err) throw err;

            // get list of companies using the found items
            CompanyItems.find({ item: { $in: itemIds } })
                .populate('item')
                .sort('price')
            .exec(function (err, citems) {
                if (err) throw err;

                // find all stores in the requested postal code
                Stores.find({ postalCode: req.params.postal })
                    .populate('company')
                .exec(function (err, foundStores) {
                    if (err) throw err;

                    // build up the display item to have a store and a citem for it
                    var results = [];

                    for (var i = 0; i < citems.length; i++) {
                        var citem = citems[i];
                        var cStores = [];
                        for (var j = 0; j < foundStores.length; j++) {
                            var store = foundStores[j];
                            if ('' + citem.company == '' + store.company._id) {
                                cStores.push(store);
                            }
                        }

                        var result = {
                            citem: citem,
                            stores: cStores,
                        };
                        results.push(result);
                    }
                    citems.forEach(function (citem) {

                    });

                    res.json(results);
                });
            });

        });
})
;

module.exports = router;
