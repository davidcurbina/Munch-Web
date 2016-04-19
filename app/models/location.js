var mongoose = require('mongoose');
module.exports = mongoose.model('Location',{
    user:String,
	name: String,
	description: String,
    opening_hours: {
        monday: {
            Open:Number,
            Close: Number
        },
        tuesday: {
            Open:Number,
            Close: Number
        },
        wednesday: {
            Open:Number,
            Close: Number
        },
        thursday: {
            Open:Number,
            Close: Number
        },
        friday: {
            Open:Number,
            Close: Number
        },
        saturday: {
            Open:Number,
            Close: Number
        },
        sunday: {
            Open:Number,
            Close: Number
        }
    },
    image:String,
    city:String,
    street:String,
    latitude:Number,
    longitude:Number,
    phonenumber:String
});

