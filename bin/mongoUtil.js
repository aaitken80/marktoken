var MongoClient = require( 'mongodb' ).MongoClient;

var _db;
var mongoURI = 'mongodb://<username>:<password>@ds159050.mlab.com:59050/marktoken';

module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect(mongoURI, function( err, db ) {
      _db = db;
      return callback( err );
    } );
  },

  getDb: function() {
    return _db;
  },

  getMongoURI: function() {
    return mongoURI;
  }
};
