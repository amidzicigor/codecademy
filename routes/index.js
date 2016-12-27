var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var {mongoose} = require('../server/db/mongoose');
var {User} = require('../server/models/user');

// var csrfProtection = csrf();
// router.use(csrfProtection);

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

  res.render('signup');
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  if (req.session.user) {
    return res.redirect('/learn');
  }

  res.render('login');
});

/* GET learn page. */
router.get('/learn', function(req, res, next) {
  if (req.session.user) {
    // Vulneralbiliy here: can search req.session.user.password for user's password. (Not hashed yet)
    return res.render('learn', {loggedIn: true, username: req.session.user.username});
  }

  res.render('learn', {loggedIn: false});
});

/* POST signup page. */
router.post('/signup', function(req, res, next) {
  var item = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  }

  var user = new User(item);
  user.save().then(() => {
    req.session.user = user;
    res.redirect('/learn');
  }).catch((e) => {
    console.log(e);
    res.redirect('/signup');
  })
});

/* POST login page. */
router.post('/login', function(req, res, next) {
  var emailOrUser = req.body.emailOrUser;
  var password = req.body.password;

  User.findOne({email: emailOrUser}).then(function (user) {
    if (user.password === password) {
      req.session.user = user;
      res.redirect('/learn');
    }
    res.redirect('/login');
  }).catch((e) => {
    console.log(e);
    res.redirect('/login');
  })
})

/* POST logout page. */
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
})

// router.post('/update', function(req, res, next) {
//   var id = req.body.id;
//
//   User.findById(id, function (err, doc) {
//     if (err) {
//       console.log(err);
//     }
//     doc.title = req.body.title;
//     doc.content = req.body.content;
//     doc.author = req.body.author;
//     doc.save();
//   });
//   res.redirect('/');
// });
//
// router.post('/delete', function(req, res, next) {
//   var id = req.body.id;
//   User.findByIdAndRemove(id).exec();
//   res.redirect('/');
// });

module.exports = router;
