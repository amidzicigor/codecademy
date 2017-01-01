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
  var messages = [];
  var errors = 0;

  var updateData = {
    name: req.body.name || null,
    email: req.body.email, // cannot be null
    username: req.body.username, // cannot be null
    location: req.body.location || null,
    language: req.body.language || null,
    aboutMe: req.body.aboutMe || null,
    website: req.body.website || null,
    gitHub: req.body.gitHub || null,
    twitter: req.body.twitter || null,
    linkedinURL: req.body.linkedinURL || null
  }

  // Check if either email or username fields are empty
  if (req.body.email === '') {
    messages.push('Email cannot be blank.');
    req.flash('error', messages);
    errors += 1;
    res.redirect('/account');
  }
  if (errors === 0) {
    if (req.body.username === '') {
      messages.push('Username is not valid. Make sure you picked a username with only letters and numbers.');
      req.flash('error', messages);
      errors += 1;
      res.redirect('/account');
    }
  }

  if (errors === 0) {
    // Check if new email is already taken
    User.findOne({email: req.body.email}, function (err, user) {
      if (err) {
        messages.push('Unexpected error occured. Please relog and try again.');
        req.flash('error', messages);
        errors += 1;
        res.redirect('/account');
      }
      if (user) {
        if (user._id != req.session.passport.user._id) {
          console.log(user._id)
          console.log(req.session.passport.user._id)
          messages.push('That email is already taken.');
          req.flash('error', messages);
          errors += 1;
          res.redirect('/account');
        }
      }

      if (errors === 0) {
        // Check if new username is already taken
        User.findOne({username: req.body.username}, function (err, user) {
          console.log(user);
          if (err && errors === 0) {
            messages.push('Unexpected error occured. Please relog and try again.');
            req.flash('error', messages);
            errors += 1;
            res.redirect('/account');
          }
          if (user) {
            if (user._id != req.session.passport.user._id && errors === 0) {
              messages.push('That username is already taken.');
              req.flash('error', messages);
              errors += 1;
              res.redirect('/account');
            }
          }

          if (errors === 0) {
            // If no errors, update user data
            User.findByIdAndUpdate(req.session.passport.user._id, {$set: updateData}, function (err, user) {
              User.findById(req.session.passport.user._id, function (err, user) {
                if (!err && errors === 0) {
                  console.log('All good');
                }
                console.log(user);
                req.login(user, function(err) {
                    if (err) return res.redirect('/account')
                })
                res.end();
                res.redirect('/account');
              })
            })
          }
        })
      }
    })
  }
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
