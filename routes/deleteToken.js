var express = require('express');
var router = express.Router();
var request = require('request');
var mongoUtil = require('../bin/mongoUtil');
var escape = require('mongo-escape').escape;
var mongodb = require('mongodb');

router.get('/', function (req, res, next) {

    if(!req.user){
       res.redirect('/');
    }

    if(req.query.id){

	    var db = mongoUtil.getDb(); 

	    db.collection('tokens').deleteOne({ "_id": new mongodb.ObjectID(req.query.id) },
		(err, result) => {
			if (err) return res.send(500, err);

            res.redirect('tokens');

		});
    }
});

module.exports = router;