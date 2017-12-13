var express = require('express');
var router = express.Router();
var request = require('request');
var mongoUtil = require('../bin/mongoUtil');
var escape = require('mongo-escape').escape;
var mongodb = require('mongodb');
var moment = require('moment');

router.get('/', function (req, res, next) {

	var db = mongoUtil.getDb();
	var cursor = db.collection('guestbook').find().sort({ postDate: -1 });

	cursor.toArray(function (err, results) {
		res.render('guestbook', { title: 'Guestbook', comments: results, moment: moment, user: req.user });
	})

});

router.post('/postcomment', (req, res) => {


	// g-recaptcha-response is the key that browser will generate upon form submit.
	// if its blank or null means user has not selected the captcha, so return the error.
	if (req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
		return res.json({ "responseCode": 1, "responseDesc": "Please select captcha" });
	}
	var secretKey = "6LdGER4UAAAAAMCcxkvCJPIdug7IUi4ebjrgkhU6";

	// req.connection.remoteAddress will provide IP address of connected user.
	var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

	request(verificationUrl, function (error, response, body) {
		body = JSON.parse(body);
		// Success will be true or false depending upon captcha validation.
		if (body.success !== undefined && !body.success) {
			return res.json({ "responseCode": 1, "responseDesc": "Failed captcha verification" });
		}

		var db = mongoUtil.getDb();

		userInput = escape(req.body);
		userInput["postDate"] = Date.now();

		db.collection('guestbook').save(userInput, (err, result) => {
			if (err) return console.log(err)
			res.redirect('/guestbook');
		});
	});

});

router.delete('/postcomment', (req, res) => {
	console.log("Deleting Comment");

	var db = mongoUtil.getDb();

	db.collection('guestbook').findOneAndDelete({ "_id": new mongodb.ObjectID(req.body.id) },
		(err, result) => {
			if (err) return res.send(500, err);

			req.flash('success', 'Message Deleted');
			res.send('/guestbook');
		});
})

module.exports = router;
