//var gcm = require('node-gcm-service');
var Instance = require('../app/models/token.js');

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
    var mongoose = require('mongoose');
    
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
    var message = new gcm.Message({
        collapseKey: 'demo',
        priority: 'high',
        contentAvailable: true,
        delayWhileIdle: true,
        timeToLive: 3,
        restrictedPackageName: "gcm.play.android.samples.com.gcmquickstart",
        dryRun: false,
        data: {
            key1: 'message1',
            key2: 'message2'
        },
        notification: {
            title: "Hello, World",
            icon: "ic_launcher",
            body: "This is a notification that will be displayed ASAP."
        }
    });

    // Change the message data
    // ... as key-value
    message.addData('key1','message1');
    message.addData('key2','message2');

    // ... or as a data object (overwrites previous data object)
    message.addData({
        key1: 'message1',
        key2: 'message2'
    });

    // Set up the sender with you API key
    var sender = new gcm.Sender('AIzaSyAjiwspjIhQRX-gC_8BbzH8G34rSTI3xKc');

    // Add the registration tokens of the devices you want to send to
    var registrationTokens = [];
    registrationTokens.push('fCEmfSjjsO4:APA91bHDoH5BL4RheRAJ610RfnQi93Vr3FV3kffTdHjTyTBdM-0FwymAc0ovK5H5KRFUIgKD3F8AdR-hMTvgk7BXvgTir-bzzIN761D58-uQxVcT8sXBHvg7gAQJwvXCfoXN3yetuzhO');
    registrationTokens.push('ejQB8n9iAqE:APA91bFk9vYvqq9-RwAOSXz5q26bAQtHxVbfWeKXpU3fAd4H-Wi3-trXtiI8gxmpc0OfeOm8enspbKtCg-UCX3n5tP8j_EdXHpfVu03P1VO-mxGTxfhUQvKWBh9v4qJRI2weIGDYFxjn');

    // Send the message
    // ... trying only once
    /*sender.sendNoRetry(message, { registrationTokens: registrationTokens }, function(err, response) {
      if(err) console.error(err);
      else    console.log(response);
    });

    // ... or retrying
    sender.send(message, { registrationTokens: registrationTokens }, function (err, response) {
      if(err) console.error(err);
      else    console.log(response);
    });*/

    // ... or retrying a specific number of times (10)
    sender.send(message, { registrationTokens: registrationTokens }, 1, function (err, response) {
      if(err) console.error(err);
      else    console.log(response);
    });
    res.send("Success");
}