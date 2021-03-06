var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var LocalStrategy = require('passport-local').Strategy;
var mongoUtil = require( './bin/mongoUtil' );
var mongoose = require('mongoose');
var flash = require('req-flash');
var fileUpload = require('express-fileupload');

var index = require('./routes/index');
var guestbook = require('./routes/guestbook');
var tokens = require('./routes/tokens');
var upload = require('./routes/upload');
var deleteToken = require('./routes/deleteToken');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(fileUpload());

app.use('/', index);
app.use('/guestbook', guestbook);
app.use('/tokens', tokens);
app.use('/upload', upload);
app.use('/deleteToken', deleteToken);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose.connect(mongoUtil.getMongoURI());

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var UserModel = new Schema({
    userId    : ObjectId
  , username     : String
  , password      : String
});

var User = mongoose.model('Users', UserModel);

//var admin = new User({username:'andrew', password: 'pass'})
//admin.save(function (err) {
//  if (err) {
//    console.log(err);
//  } else {
//    console.log('meow');
//  }
//});

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(id, done) {
  console.log('Deserialize user called.');
  User.findOne({ username: id }, function (err, user) {
    return done(null, user);
  })
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
		  console.log('Wrong Username.');
		  return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.password == password) {
		  console.log('Wrong Password.');
		  return done(null, false, { message: 'Incorrect password.' });
      }
      console.log('Success.');
	  return done(null, user);
    });
  }
));

module.exports = app;
