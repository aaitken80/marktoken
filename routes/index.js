var express = require('express');
var router = express.Router();
var mongoUtil = require( '../bin/mongoUtil' );
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Marktoken', user: req.user });
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: false })
);

router.get('/links', function(req, res, next) {

	res.render('links', { title: 'Links', user: req.user });
});

router.get('/login', function(req, res, next) {

	res.render('login', { title: 'Login', user: req.user });
});


module.exports = router;
