var express = require('express');
var router = express.Router();
var mongoUtil = require( '../bin/mongoUtil' );
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET home page. */
router.get('/', function(req, res, next) {

	res.render('index', { title: 'Express', user: req.user });
});

router.post('/quotes', (req, res) => {
	
	var db = mongoUtil.getDb();
	
	db.collection('quotes').save(req.body, (err, result) => {
		if (err) return console.log(err)

		console.log('saved to database')
		res.redirect('/')
	});
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/',
                                   failureFlash: false })
);

module.exports = router;
