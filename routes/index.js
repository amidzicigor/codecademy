var express         = require('express');
var router          = express.Router();
var csrf            = require('csurf');
var passport        = require('passport');

var {mongoose}      = require('../server/db/mongoose');
var {User}          = require('../server/models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.session.user) {
    return res.redirect('/learn');
  }
  res.render('index');
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  if (req.session.user) {
    return res.redirect('/learn');
  }
  var messages = req.flash('error');
  res.render('signup', {messages: messages, hasErrors: messages.length > 0});
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  if (req.session.user) {
    return res.redirect('/learn');
  }

  var messages = req.flash('error');
  res.render('login', {messages: messages, hasErrors: messages.length > 0});
});

/* GET learn page. */
router.get('/learn', function(req, res, next) {
  if (req.session.user) {
    console.log(req.session.user);
    return res.render('learn', {user: req.session.user, loggedIn: true})
  }

  res.render('learn');
});

/* GET account page. */
router.get('/account', isLoggedIn, function(req, res, next) {
  res.render('account', {user: req.session.user});
});

// --------------------------------- POST ----------------------------------- //

/* POST signup page. */
router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/learn',
  failureRedirect: '/signup',
  failureFlash: true
}));

router.post('/login', passport.authenticate('local.login', {
  successRedirect: '/learn',
  failureRedirect: '/login',
  failureFlash: true
}));

/* Signup with facebook */
// router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));
//
// router.get('/auth/facebook/callback',
//   passport.authenticate('facebook', { successRedirect: '/learn',
//                                       failureRedirect: '/login' }));

/* POST login page. */
router.post('/login', function(req, res, next) {

})

/* POST logout page. */
router.post('/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');
})

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
