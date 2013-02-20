
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , Facebook = require('facebook-node-sdk')
  , mongoose = require('mongoose')
  , usermodel = require('./models/usermodel')
  , User = usermodel.User
  , books = require('./routes/book');

var app = express();

app.configure(function(){
  mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/PnPNotes');
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(Facebook.middleware({ appId: '156768901145282', secret: 'ef46fa1e3f9a79de75073bfac5b02adb' }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

//req.user is actually facebook ID not name
function facebookGetUser() {
  return function(req, res, next) {
    req.facebook.getUser( function(err, user) {
      if (!user || err){
        res.render('login', { title: 'PnPNotes' });
      } else {
        req.user = user;
        req.session.user = user;
        console.log("Got User.");
        next();
      }
    });
  }
}

app.get('/', facebookGetUser(), function(req, res){
  req.facebook.api('/me', function(err, user) {
    userID = req.user;
    name = user.name;
    User.findOne({userID:userID}, function (err, doc) {
      if(err){
        console.log("Oops!");
      }
      if(!doc){
        console.log(name + " not found.");
        var newUser = new User({userID: userID, name: name, color: "#FFFFFF"});
        newUser.save(function (err) {
          if (err){
            return console.log("Danger Will Robinson!");
          }
          else{
            console.log("User created: " + name);
            res.redirect('/');
          }
        })
      }
      else{
        console.log("Name: " + name + " ID: " + userID );
        res.render('index', { title: 'PnPNotes', name: name, userID: userID });
      }
    });
  });
});
app.get('/login', Facebook.loginRequired(), function(req, res){
  res.redirect('/');
});
app.get('/logout', facebookGetUser(), function(req, res){
  req.user = null;
  req.session.destroy();
  res.redirect('/');
});
app.get('/books', facebookGetUser(), books.list);
app.post('/books/create', facebookGetUser(), books.create);
app.post('/books/remove', facebookGetUser(), books.remove);
app.get('/books/:title/:chapter', facebookGetUser(), books.displayNotes);
app.post('/books/:title/:chapter/create', facebookGetUser(), books.createNote);
app.post('/books/:title/:chapter/remove', facebookGetUser(), books.removeNote);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});