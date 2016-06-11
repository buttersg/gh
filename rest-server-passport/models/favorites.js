// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// found info online for what to do from discussion post
// https://www.coursera.org/learn/server-side-development/lecture/TsjQf/assignment-4-video-requirements/discussions/Hs6LA_yUEeWpRBJSZ0Y3Bw
// http://stackoverflow.com/questions/10568281/mongoose-using-populate-on-an-array-of-objectid

// create a schema
var favoriteSchema = new Schema({    
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [{ type: Schema.ObjectId, ref: 'Dish', unique: true }]
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Favorites = mongoose.model('Favorites', favoriteSchema);

// make this available to our Node applications
module.exports = Favorites;
