var mongoose = require("mongoose");
var Location = require("../app/models/location.js");

module.exports.locations = function(request, response) {
    
    Location.find({},function(err, result){
        if(err)
            console.log("Error fidn locations");
        response.send(result);
    })
    .exec(function(err,result){
        if (err)
            response.send(err.toString())
    })
}

module.exports.categories = function(request, response) {
    
    var username = request.body.username;
    
    Location.findOne({user:username},'categories',function(err, result){
        if(err)
            console.log("Error finding categories");
        response.send(result);
    })
    .exec(function(err,result){
        if (err)
            response.send(err.toString())
    })
}

module.exports.updateLocation = function(request, response){
    var username = request.body.username;
    var new_name = request.body.name;
    var new_description = request.body.description;
    var new_city = request.body.city;
    var new_street = request.body.street;
    var new_image = request.body.image;
    var new_lat = request.body.lat;
    var new_long = request.body.long;
    var new_number = request.body.phonenumber;
    
    Location.update({user:username}, {
        description: new_description,
        city: new_city,
        image:new_image,
        street:new_street,
        latitude:new_lat,
        longitude:new_long,
        phonenumber:new_number,
        name:new_name
    }, function(err, numberAffected, rawResponse){
        if(err)
            response.send("Unable to update records");
        response.send("Success");
    });
}
module.exports.addCategory = function(request, response){
    var username = request.body.username;
    var new_category = request.body.category;
    
    Location.findOne({user:username}, 
        function(err, location){
            if(err)
                response.send("Error");
            console.log(location);
            location.categories.push({category:new_category});
            location.save(function(err, res){
                if(err)
                    response.send("Error");
                response.send("Success");
            });
        //response.send("Here");
        });
}
module.exports.addItem = function(request, response){
    var username = request.body.username;
    var category = request.body.category;
    var item_name = request.body.name;
    var item_price = request.body.price;
    
    Location.update(
        {user: username, 'categories.category': category}, 
        {$push: {'categories.$.items': {name:item_name, price:item_price}}        
        },
        function(err, numAffected) {
            if(err)
                response.send("Error");
        response.send(numAffected);
    });
}