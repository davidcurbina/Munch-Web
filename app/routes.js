// app/routes.js
var notificationController = require('../config/notificationController.js');
var applicationController = require('../config/applicationController.js');
var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

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

    //app.post('/register', passport.authenticate('login'), notificationController.register);

    app.post('/addCategory', auth, applicationController.addCategory);
    app.post('/updateCategory', auth, applicationController.updateCategory);
    app.post('/addItem', auth, applicationController.addItem);
    app.post('/updateItem', auth, applicationController.updateItem);
    app.get('/instances',passport.authenticate('login'), notificationController.find);

    app.get('/locations', applicationController.locations);

    app.post('/location', applicationController.locationDetails);

    app.post('/categories', applicationController.categories);
    app.post('/items',auth, applicationController.items);

    app.post('/update_location', applicationController.updateLocation);

    app.post('/login', function(req, res, next){
      passport.authenticate('login', function(err, user, info){
        if(err){ return next(err); }

        if(user){
          return res.json({token: user.generateJWT(),isAdmin:user.isAdmin()});
        } else {
          return res.status(401).json(info);
        }
      })(req, res, next);
    });
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.post('/register', function(req, res) {
        console.log(req.body);

        var User = require('./models/user.js');

        var sUsername = req.body.username;
        var sEmail = req.body.email;
        var sPassword = req.body.password;
        var sAdmin = req.body.admin;
        var exists = false;

        User.find({username: sUsername}, function(err,results){
            if (err){
                console.log("err");
            }
            if(results && results.length === 1){
                console.log("Results:"+results);
                console.log("User already exits");
                exists = true;
                res.send("User already exists");
            }else {
                var new_user = new User({username: sUsername, password:sPassword, admin:sAdmin,email:sEmail});
                new_user.save();
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
