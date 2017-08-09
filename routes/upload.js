var express = require('express');
var router = express.Router();
var request = require('request');
var mongoUtil = require('../bin/mongoUtil');
var escape = require('mongo-escape').escape;
var mongodb = require('mongodb');

router.get('/', function (req, res, next) {
    res.render('uploadtoken', { title: 'Upload', user: req.user });
});

router.post('/', function (req, res) {
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

    // Use the mv() method to place the file somewhere on your server 
    obverseImage.mv('../public/images/' + obverseImage.name, function (err) {
        if (err)
            return res.status(500).send(err);
        //res.send('File uploaded!');
    });

    reverseImage.mv('../public/images/' + reverseImage.name, function (err) {
        if (err)
            return res.status(500).send(err);
        //res.send('File uploaded!');
    });

    db.collection('tokens').save(userInput, (err, result) => {
        if (err) return console.log(err)
        res.redirect('/upload');
    });


});

module.exports = router;