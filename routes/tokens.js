var express = require('express');
var router = express.Router();
var mongoUtil = require( '../bin/mongoUtil' );
var escape = require('mongo-escape').escape;
var mongodb = require( 'mongodb' );

router.get('/', function(req, res, next) {

	var db = mongoUtil.getDb();
	var cursor = db.collection('tokens').find()
	
	db.collection('tokens').find().toArray(function(err, results) {
		res.render('tokens', { title: 'Tokens', tokens: results });
	})

});

router.post('/find', function(req,res,next) {

	var db = mongoUtil.getDb();
	var cursor = db.collection('tokens').find()
	
    userInput = escape(req.body.search);

    if(userInput.length > 0){
        db.collection('tokens').find({ $text: { $search: "\"" + userInput +  "\"" } }).toArray(function(err, results) {
            res.render('tokens', { title: 'Tokens', tokens: results });
        })
    } else {
        res.redirect("/tokens");
    }
});

module.exports = router;