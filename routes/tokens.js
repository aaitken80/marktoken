var express = require('express');
var router = express.Router();
var mongoUtil = require( '../bin/mongoUtil' );
var escape = require('mongo-escape').escape;
var mongodb = require( 'mongodb' );

var pageSize = 12;
var country;
var search;

router.get('/:pageNo', function(req, res, next) {

    if(!req.params.pageNo){
        req.params.pageNo = 1;
    }

    var userInput = escape(req.query.search);
    var query = {};

    if(search){
        query = search;
    }
  
    if(req.query.country){
        country = escape(req.query.country);
    }

    if(country){
        query.country = country;
    }

    if(req.query.list && req.query.list === "list"){
        pageSize=0
    } else {
        if(req.query.list === "grid"){
            pageSize = 12;
        }
        if(req.query.pageSize){
            if(escape(req.query.pageSize) === "All"){
                pageSize=0;
            } else {
                pageSize = Number(escape(req.query.pageSize));
            } 
        }
    }

	var db = mongoUtil.getDb();
	var cursor = db.collection('tokens').find(query).sort({no: 1}).skip((req.params.pageNo -1)*pageSize).limit(pageSize);
    
    db.collection('tokens').find(query).sort({no: 1}).count(function(err, pageCount){

        cursor.toArray(function(err, results) {
            res.render('tokens', { title: 'Tokens', pages:Math.ceil(pageCount/pageSize), currentPage : req.params.pageNo, tokens: results, country: escape(req.query.country), list: req.query.list, user: req.user});
        });

    });
});

router.get('/', function(req, res, next) {

    var userInput = escape(req.query.search);
    var query = {};

    if(userInput && userInput.length >0){
        search = { $text: { $search: "\"" + userInput +  "\"" } };
    } 

    if(search && userInput){
        query = { $text: { $search: "\"" + userInput +  "\"" } };
    } else {
        search = undefined;
    }

    if(req.query.country){
        country = escape(req.query.country);
    }

    if(country){
        query.country = country;
    }

    
    if(req.query.list && req.query.list === "list"){
        pageSize=0
    } else {
        if(req.query.list === "grid"){
            pageSize = 12;
        }
        if(req.query.pageSize){
            if(escape(req.query.pageSize) === "All"){
                pageSize=0;
            } else {
                pageSize = Number(escape(req.query.pageSize));
            } 
        }
    }

	var db = mongoUtil.getDb();
	var cursor = db.collection('tokens').find(query).sort({no: 1}).limit(pageSize);
	
    db.collection('tokens').find(query).sort({no: 1}).count(function(err, pageCount){
        cursor.toArray(function(err, results) {
            res.render('tokens', { title: 'Tokens', pages:Math.ceil(pageCount/pageSize), currentPage: 1, tokens: results, country: escape(req.query.country), list: req.query.list, user: req.user});
        });
    });

});

module.exports = router;