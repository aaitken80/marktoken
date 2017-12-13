var express = require('express');
var router = express.Router();
var request = require('request');
var mongoUtil = require('../bin/mongoUtil');
var escape = require('mongo-escape').escape;
var mongodb = require('mongodb');
var path = require('path');
var uploadDir = path.join(__dirname, '../public/images');

router.get('/', function (req, res, next) {

    if(!req.user){
       res.redirect('/');
    }

    if(req.query.id){

	    var db = mongoUtil.getDb(); 

	    db.collection('tokens').findOne({ "_id": new mongodb.ObjectID(req.query.id) },
		(err, result) => {
			if (err) return res.send(500, err);

            res.render('uploadtoken', { title: 'Upload', user: req.user, token: result});

		});
    } else {

        blankToken = {
                "no": null,
                "lodge": null,
                "province": null,
                "reverse": null,
                "size": null,
                "shape": null,
                "image": null,
                "country": null,
                "comments": null,
                "obverseImage": null,
                "reverseImage":null,
                "reserve": null
            }

        res.render('uploadtoken', { title: 'Upload', user: req.user, token: blankToken});
    }

    
});

router.post('/', function (req, res) {
    
    if(!req.user){
       res.redirect('/');
    }

    //we have an id so we are editing
    if(req.body.tokenId){

        var db = mongoUtil.getDb();

        tokenId = req.body.tokenId;
        delete req.body.tokenId;
        userInput = escape(req.body);

        lodgeNumber = parseInt(userInput.no);

        if(!isNaN(lodgeNumber)){
            userInput.no = lodgeNumber;
        }

        var obverseImage;
        var reverseImage;

        if(req.files){
            if(req.files.obverseImage){
                obverseImage = req.files.obverseImage;
                userInput.obverseImage = obverseImage.name;

                var obverseUploadPath = path.join(uploadDir, obverseImage.name);
                obverseImage.mv(obverseUploadPath, function (err) {
                    if (err)
                        return res.status(500).send(err);
                });
            }
            if(req.files.reverseImage){
                reverseImage = req.files.reverseImage;
                userInput.reverseImage = reverseImage.name;

                var reverseUploadPath = path.join(uploadDir, reverseImage.name);
                reverseImage.mv(reverseUploadPath, function (err) {
                    if (err)
                        return res.status(500).send(err);
                });
            }
        }

        db.collection("tokens").updateOne(
            {"_id" : new mongodb.ObjectID(tokenId)},
            {"$set": userInput},
        (err, result) => {
            if (err) return console.log(err)
            res.redirect('/upload');
        });


    } else {
        if (!req.files)
            return res.status(400).send('No files were uploaded.');

        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
        var obverseImage = req.files.obverseImage;
        var reverseImage = req.files.reverseImage;

        var db = mongoUtil.getDb();

        userInput = escape(req.body);

        lodgeNumber = parseInt(userInput.no);

        if(!isNaN(lodgeNumber)){
            userInput.no = lodgeNumber;
        }

        userInput.obverseImage = obverseImage.name;
        userInput.reverseImage = reverseImage.name;

        var obverseUploadPath = path.join(uploadDir, obverseImage.name);
        console.log('Obverse Upload Path ' + obverseUploadPath);

        var reverseUploadPath = path.join(uploadDir, reverseImage.name);
        console.log('Reverse Upload Path ' + reverseUploadPath);

        // Use the mv() method to place the file somewhere on your server 
        obverseImage.mv(obverseUploadPath, function (err) {
            if (err)
                return res.status(500).send(err);
            //res.send('File uploaded!');
        });

        reverseImage.mv(reverseUploadPath, function (err) {
            if (err)
                return res.status(500).send(err);
            //res.send('File uploaded!');
        });

        db.collection('tokens').save(userInput, (err, result) => {
            if (err) return console.log(err)
            res.redirect('/upload');
        });
    }



});

module.exports = router;