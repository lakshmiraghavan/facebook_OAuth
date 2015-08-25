var express = require('express');
var router = express.Router();
var FB = require('fb');

FB.options({accessToken: 'CAAB2ZAkuZADJUBAF2N0QTyVXihxjQ42VFUEmp0UEluk697AU4y8mr00lmGTMOthETGNi6H5WddZCZBUSLxd4ZA3L40ecWmPqNnzdCZC8FBHnMwZA4UG4c9tZBKelCEcDeG6I7v2VTwZA1aoOgUnnkJWd3FnrXEw8Yfzgw4uagnX0cdKoGUU7gFoo1mo5oZCDLGlds9JEViCUPZCkD3jpBIY6w6K'});



var passport = require('passport')
    , util = require('util')
    , FacebookStrategy = require('passport-facebook').Strategy
    , session = require('express-session')
    , methodOverride = require('method-override');


var FACEBOOK_APP_ID = '933269920075389';
var FACEBOOK_APP_SECRET = '99579d50c41859c7f9206075b41a7841';
var CALLBACK_URL = 'http://localhost:3000/auth/facebook/callback';

var friends = 0;


passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, done) {

        process.nextTick(function () {


            return done(null, profile);
        });
    }
));

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { user:req.user});
});


router.get('/account',function(req,res,next){

    if(req.isAuthenticated()){return next()}
    res.redirect('/login');
},function(req,res){
    res.render('account',{user:req.user});
});


router.get('/login', function(req, res){
    res.render('login', { user: req.user });
});

router.get('/auth/facebook',passport.authenticate('facebook',{scope:'email'}),function(req,res){
    //console.log(req);
    res.status(200).json({message:'authenticated'});
});

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        getFriends();
        console.log(res);
        console.log("===>",{user:req.user, friends:friends})
        res.render('account',{user:req.user, friends:friends});
    });


function getFriends() {

    FB.api('/me/taggable_friends', function(response) {
        console.log(response);
        console.info(response.data);

        if(response.data) {
            console.log('in');
            console.log(response.data);

            var arr = Array.prototype.slice.call(response.data);
            console.log(arr);
          //  console.log(arr.length);
            friends = arr.length;
            console.log(friends);


           /* $.each(response.data,function(index,friend) {
                console.log(friend.name + ' has id:' + friend.id);
            });*/
        } else {
            console.log("Error!", response.data);
        }

    });
}

module.exports = router;
