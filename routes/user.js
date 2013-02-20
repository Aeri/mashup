var usermodel = require('../models/usermodel');
var User = usermodel.User;

exports.tweet = function(req, res){
  res.send("DERP");
};

exports.new = function(req, res){
  res.render('user', { title: 'Sign in or Register' });
};

exports.create = function(req, res){
  inputUsername = req.body.name
  console.log(inputUsername);
  User.findOne({name:inputUsername}, function (err, doc) {
    if(err){
	  console.log("Oops!");
	}
    if(!doc){
      console.log(inputUsername + " not found.");
      var newUser = new User({ name: inputUsername });
      newUser.save(function (err) {
        if (err){
          return console.log("Username error.");
	    }
        else{
          req.session.user = inputUsername;
          console.log("Username created: " + req.session.user);
          res.redirect('/');
        }
      })
    }
    else{
      req.session.user = inputUsername;
      console.log("Signed in as: " + req.session.user);
      res.redirect('/');
    }

  });
};