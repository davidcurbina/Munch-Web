var mongoose = require('mongoose');
module.exports = mongoose.model('Token',{
	instance_id: String,
	date_in:{ type: Date, default: Date.now },
    type:String
});

