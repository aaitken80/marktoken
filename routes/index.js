var express = require('express');
var router = express.Router();
var mongoUtil = require( '../bin/mongoUtil' );
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET home page. */
router.get('/', function(req, res, next) {
	
	var db = mongoUtil.getDb();
	var cursor = db.collection('quotes').find()
	
	db.collection('quotes').find().toArray(function(err, results) {
			
		res.render('index', { title: 'Express', quotes: results, user: req.user });
	})

});

router.get('/tokens', function(req, res, next) {

	var db = mongoUtil.getDb();
	var cursor = db.collection('quotes').find()
	
	db.collection('tokens').find().toArray(function(err, results) {
		res.render('tokens', { title: 'Tokens', tokens: results });
	})
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
