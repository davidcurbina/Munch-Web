var mongoose = require('mongoose');
var userSchema = mongoose.Schema({
    user:String,
	  name: String,
	  description: String,
    image:String,
    city:String,
    street:String,
    latitude: {type:Number, default:18.082858},
    longitude:{type:Number, default:-88.569125},
    phonenumber:String,
    categories:[
                {
                    category:String,
                    items:[
                            {
                                name: String,
                                price: Number,
                                description: String,
                                options:[
                                          {
                                            name:String,
                                            multiple:Boolean,
                                            elements: [
                                                        {
                                                          text: String,
                                                          price: Number
                                                        }
                                            ]
                                          }
                                ]
                            }
                        ]
                }
            ]
    }
);

module.exports = mongoose.model('Location', userSchema);
