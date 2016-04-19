//var gcm = require('node-gcm-service');
var Instance = require('../app/models/token.js');
var mongoose = require('mongoose');

module.exports.register = function(request,response){
    var mongoose = require('mongoose');
    
    var exists = false;
    response.contentType('application/json');
    
    var instanceID = request.body.instanceID;
    console.log("InstanceID:" +  request.body.instanceID);
    
    Instance.find({instance_id: instanceID}, function(err,results){
            if (err){
                console.log("err");
            }
            if(results && results.length === 1){
                console.log("Results:"+results);
                console.log("User already exits");
                exists = true;
            }else {
                var token = new Instance({instance_id: instanceID});
                token.save();
            }
        })
     .exec(function(err,results){
        if (err) throw err;
        if(exists == true){
            response.send("User Already Exists");
        } else {
            response.send("Success");
        }
    });
}

module.exports.find = function(request,response){
    //response.contentType('application/json');
    
    Instance.find({}, function(err,results){
            if (err){
                console.log("err");
            } 
        response.send(results);
    })
     .exec(function(err,results){
        if (err) throw err;
    });
}

module.exports.send = function(req,res){
    var gcm = require('node-gcm');

    // Create a message
    // ... with default values
    var message = new gcm.Message();

    // ... or some given values
    /*var message = new gcm.Message({
        collapseKey: 'demo',
        priority: 'high',
        contentAvailable: true,
        delayWhileIdle: true,
        timeToLive: 3,
        restrictedPackageName: "davidurbina.weplan",
        dryRun: false,
        data: {
            message: 'This is a notification that will be displayed ASAP.',
            key2: 'message2'
        },
        notification: {
            title: "Hello, World",
            icon: "ic_launcher",
            message: "This is a notification that will be displayed ASAP."
        }
    });*/

    // ... as key-value
    message.addData('message','Hey David!');
    message.addData('title','Hello');

    // Set up the sender with you API key
    var sender = new gcm.Sender('AIzaSyAHfse2B5gHtihCNwjoTSrTsNvImAhNecU');

    var instances;
    /*
    Instance.find({}, function(err,results){
            if (err){
                res.send("Error finding tokens.");
                console.log("err");
            } 
        instances = results;
        console.log(instances.length);
        var registrationTokens = [];
        for(var i = 0; i < instances.length; i++){
            registrationTokens.push(instances[i].instance_id);
            console.log("Sending to:"+instances[i].instance_id+"/n");
        }

        
    })
     .exec(function(err,results){
        if (err) throw err;
        res.send("Unable to access token database");
    });*/
    
    sender.send(message, { topic: '/topics/Test'} , 1, function (err, response) {
        if(err) {
            console.error(err);
            res.send("Error sending gcm messages.");
        }
          else    
              res.send("Success");
        });
}