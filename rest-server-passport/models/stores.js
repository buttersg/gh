var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    postalCode: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    address: {
        type: String
    },
    country: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String
    }
}, {
    timestamps: true
});

var model = mongoose.model('Store', objSchema);
module.exports = model;
