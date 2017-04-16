var express = require('express');
var router = express.Router();
var mongoUtil = require( '../bin/mongoUtil' );
var escape = require('mongo-escape').escape;
var mongodb = require( 'mongodb' );

router.get('/:pageNo', function(req, res, next) {

    if(!req.params.pageNo){
        req.params.pageNo = 1;
    }

    var userInput = escape(req.query.search);
    var query = {};

    if(userInput && userInput.length >0){
        query = { $text: { $search: "\"" + userInput +  "\"" } };
    }

	var db = mongoUtil.getDb();
	var cursor = db.collection('tokens').find(query).skip((req.params.pageNo -1)*12).limit(12);
    
    db.collection('tokens').find(query).count(function(err, pageCount){

        cursor.toArray(function(err, results) {
            res.render('tokens', { title: 'Tokens', pages:Math.ceil(pageCount/12), currentPage : req.params.pageNo, tokens: results });
        })

    });
});

router.get('/', function(req, res, next) {

    var userInput = escape(req.query.search);
    var query = {};

    if(userInput && userInput.length >0){
        query = { $text: { $search: "\"" + userInput +  "\"" } };
    }

	var db = mongoUtil.getDb();
	var cursor = db.collection('tokens').find(query).limit(12);
	
    db.collection('tokens').find(query).count(function(err, pageCount){
        cursor.toArray(function(err, results) {
            res.render('tokens', { title: 'Tokens', pages:Math.ceil(pageCount/12), currentPage: 1, tokens: results });
        })
    });

});

router.get('/scottish', function(req, res, next) {

	var db = mongoUtil.getDb();
	var cursor = db.collection('tokens').find({country : "Scottish"})
	
	cursor.toArray(function(err, results) {
		res.render('tokens', { title: 'Tokens', tokens: results });
	})

});

module.exports = router;