var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var objSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

objSchema.index({ name: 'text' });

var model = mongoose.model('Item', objSchema);
module.exports = model;
