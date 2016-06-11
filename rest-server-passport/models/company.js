var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
}, {
    timestamps: true
});

var model = mongoose.model('Company', objSchema);
module.exports = model;
