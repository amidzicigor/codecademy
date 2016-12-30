var express         = require('express');
var router          = express.Router();
var passport        = require('passport');


// Check if user is logged in
router.use('/', isLoggedIn, function (req, res, next) {
  next();
});

/* GET account page. */
router.get('/', function(req, res, next) {
  res.render('account/account');
});

/* GET password page. */
router.get('/password', function(req, res, next) {
  res.render('account/password');
});

/* GET mail_settings page. */
router.get('/mail_settings', function(req, res, next) {
  res.render('account/mail_settings');
});

/* GET linked_accts page. */
router.get('/linked_accts', function(req, res, next) {
  res.render('account/linked_accts');
});

/* GET delete_acct page. */
router.get('/delete_acct', function(req, res, next) {
  res.render('account/delete_acct');
});

// ------------------------------- UPDATES ---------------------------------- //
router.post('/user-update', passport.authenticate('local.update', {
  successRedirect: '/account',
  failureRedirect: '/',
  failureFlash: true
}));

// Check logged in function
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
