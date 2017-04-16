var express = require('express');
var router = express.Router();
var mongoUtil = require( '../bin/mongoUtil' );
var escape = require('mongo-escape').escape;
var mongodb = require( 'mongodb' );

router.get('/', function(req, res, next) {
	
	var db = mongoUtil.getDb();
	var cursor = db.collection('guestbook').find().sort({postDate : -1});

	cursor.toArray(function(err, results) {
		res.render('guestbook', {comments: results, flash: req.flash()});
	})

});

router.post('/postcomment', (req, res) => {
	
	var db = mongoUtil.getDb();
	
	userInput = escape(req.body);

	userInput["postDate"] = Date.now();
	
	db.collection('guestbook').save(userInput, (err, result) => {
		if (err) return console.log(err)
		res.redirect('/guestbook');
	});
});

router.delete('/postcomment', (req, res) => {
  console.log("Deleting Comment");
	
	var db = mongoUtil.getDb();

	db.collection('guestbook').findOneAndDelete({"_id": new mongodb.ObjectID(req.body.id)},
	(err, result) => {
		if (err) return res.send(500, err)

		req.flash('success', 'Message Deleted');
		res.send('/guestbook');
	})
})

module.exports = router;
