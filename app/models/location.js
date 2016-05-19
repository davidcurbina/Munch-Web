var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    user:String,
	  name: String,
	  description: String,
    image:String,
    city:String,
    street:String,
    latitude:Number,
    longitude:Number,
    phonenumber:String,
    categories:[
                {
                    category:String,
                    items:[
                            {
                                name: String,
                                price: Number,
                                description: String
                            }
                        ]
                }
            ]
    }
);

module.exports = mongoose.model('Location', userSchema);
