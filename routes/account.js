var express         = require('express');
var router          = express.Router();
var passport        = require('passport');

var {mongoose}      = require('../server/db/mongoose');
var {User}          = require('../server/models/user');

// Check if user is logged in
router.use('/', isLoggedIn, function (req, res, next) {
  next();
});

/* GET account page. */
router.get('/', function(req, res, next) {
  var messages = req.flash('error');
  res.render('account/account', { messages: messages, hasErrors: messages.length > 0 });
});

/* GET password page. */
router.get('/password', function(req, res, next) {
  var messages = req.flash('error');
  res.render('account/password', { messages: messages, hasErrors: messages.length > 0});
});

/* GET mail_settings page. */
router.get('/mail_settings', function(req, res, next) {
  var messages = req.flash('error');
  res.render('account/mail_settings', { messages: messages, hasErrors: messages.length > 0 });
});

/* GET linked_accts page. */
router.get('/linked_accts', function(req, res, next) {
  var messages = req.flash('error');
  res.render('account/linked_accts', { messages: messages, hasErrors: messages.length > 0 });
});

/* GET delete_acct page. */
router.get('/delete_acct', function(req, res, next) {
  var messages = req.flash('error');
  res.render('account/delete_acct', { messages: messages, hasErrors: messages.length > 0 });
});

// ------------------------------- UPDATES ---------------------------------- //
// ------------------------------ Basic info -------------------------------- //
router.post('/user-update', function (req, res, next) {
  var updateData = {
    name: req.body.name || null,
    email: req.body.email || req.session.user.email, // cannot be null
    username: req.body.username || req.session.user.username, // cannot be null
    location: req.body.location || null,
    language: req.body.language || null,
    aboutMe: req.body.aboutMe || null,
    website: req.body.website || null,
    gitHub: req.body.gitHub || null,
    twitter: req.body.twitter || null,
    linkedinURL: req.body.linkedinURL || null
  }

  User.findByIdAndUpdate(req.session.passport.user._id, {$set: updateData}, function (err, user) {
    User.findById(req.session.passport.user._id, function (err, user) {
      if (!err) {
        console.log('All good');
      }
      console.log(user);
      req.login(user, function(err) {
          if (err) return next(err)
      })
      res.end();
      res.redirect('/account');
    })
  })
});

// ------------------------------- Password --------------------------------- //
router.post('/password-update', function (req, res, next) {
  User.findById(req.session.passport.user._id, function (err, user) {
    var messages = [];
    if (err) {
      messages.push('Something went wrong.');
      req.flash('error', messages);
      res.redirect('/account/password');
    } else if (!user) {
      messages.push('Please relog and try again.');
      req.flash('error', messages);
      res.redirect('/account/password');
    } else if (!user.validPassword(req.body.currentPassword)) {
      messages.push('Incorrect password');
    }

    req.login(user, function(err) {
        if (err) return next(err)
    })
    req.flash('error', messages);
    res.end();
    res.redirect('/account/password');
    console.log('IT WORKED');
  })
});

// Check logged in function
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
