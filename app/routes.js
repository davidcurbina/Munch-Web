// app/routes.js
var notificationController = require('../config/notificationController.js');

module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.send("Hello World"); // load the index.ejs file
    });

    // process the login form
    /*app.post('/login', passport.authenticate('local-login', function(req,res){
    
    }));*/

    // process the signup form
    app.post('/send', passport.authenticate('login'), notificationController.send);

    app.post('/register', passport.authenticate('login'), notificationController.register);

    app.get('/instances',passport.authenticate('login'), notificationController.find);
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.post('/register', function(req, res) {
        var Instance = require('./models/token.js');
        
        var instanceID = req.body.instanceID;
        Instance.find({instance_id: instanceID}, function(err,results){
            if (err){
                console.log("err");
            }
            if(results && results.length === 1){
                console.log("Results:"+results);
                console.log("User already exits");
                exists = true;
                res.send("ID:"+instanceID);
            }else {
                var token = new Instance({instance_id: instanceID});
                token.save();
                res.send("ID:"+instanceID);
            }
        })
         .exec(function(err,results){
            if (err) throw err;
            if(exists == true){
                res.send("User Already Exists");
            } else {
                res.send("Success");
            }
        });
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
} 