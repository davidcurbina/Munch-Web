var mongoose = require("mongoose");
var Location = require("../app/models/location.js");

module.exports.locations = function(request, response) {

    Location.find({},function(err, result){
        if(err)
            console.log("Error fidn locations");
        response.send(result);
    })
    .select({ 'name': 1,
              'description':1,
              'image':1,
              'latitude':1,
              'longitude':1,
              'user':1,_id: 0 })
    .exec(function(err,result){
        if (err)
            response.send(err.toString())
    })
}

module.exports.locationDetails = function(request, response) {

    var username = request.body.username;

    Location.findOne({user:username},function(err, result){
        if(err)
            console.log("Error finding categories");
        response.send(result);
    })
    .exec(function(err,result){
        if (err)
            response.send(err.toString())
    })
}

module.exports.categories = function(request, response) {

    var username = request.body.username;

    Location.findOne({user:username},function(err, result){
        if(err)
            console.log("Error finding categories");
        response.send(result);
    })
    .exec(function(err,result){
        if (err)
            response.send(err.toString())
    })
}

module.exports.items = function(request, response) {

    var username = request.body.username;
    var category = request.body.category;

    Location.findOne({user:username, 'categories.category': category}, 'categories.$.items',function(err, result){
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

  var new_location = new Location(request.body);
    var username = new_location.user;
    var new_name = new_location.name;
    var new_description = new_location.description;
    var new_city = new_location.city;
    var new_street = new_location.street;
    var new_image = new_location.image;
    var new_lat = new_location.latitude;
    var new_long = new_location.longitude;
    var new_number = new_location.phonenumber;
    var new_categories = new_location.categories;

    if (typeof new_lat === 'undefined') {
        new_lat = -1;
    }
    if (typeof new_long === 'undefined'){
      new_long = -1;
    }
    console.log(new_long);
    Location.update({user:username}, {
        description: new_description,
        city: new_city,
        image:new_image,
        street:new_street,
        latitude:new_lat,
        longitude:new_long,
        phonenumber:new_number,
        name:new_name,
        categories:new_categories
    }, function(err, numberAffected, rawResponse){
        if(err)
            console.log(err);//response.send("Unable to update records");
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
module.exports.updateCategory = function(request, response){
    var username = request.body.username;
    var category = request.body.category;
    var category_name = request.body.new_name;

    Location.update(
        {user: username, 'categories.category': category},
        {$set: {'categories.$.category': category_name}
        },
        function(err, numAffected) {
            if(err)
                response.send("Error");
        response.send(numAffected);
    });
}
module.exports.updateItem = function(request, response){
    var username = request.body.username;
    var category = request.body.category;
    var item = request.body.item;
    var item_name = request.body.new_name;
    var item_description = request.body.new_description;

    Location.update(
        {user: username, 'categories.category': category, 'categories.items.name': item},
        {$set: {'categories.$.items.$.name': item_name, 'categories.$.items.$.description': item_description}
        },
        function(err, numAffected) {
            if(err)
                response.send("Error");
        response.send(numAffected);
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
