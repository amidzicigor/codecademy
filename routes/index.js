var express = require('express');
var router = express.Router();
var {mongoose} = require('../server/db/mongoose');
var {User} = require('../server/models/user');

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index');
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('signup');
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* POST signup page. */
router.post('/signup', function(req, res, next) {
  var item = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  }

  var user = new User(item);
  user.save();
  res.redirect('/');
});

/* POST login page. */
router.post('/login', function(req, res, next) {
  var emailOrUser = req.body.emailOrUser;
  var password = req.body.password;

  User.findOne({email: emailOrUser}).then(function (user) {
    req.session.user = user;
    res.redirect('/dashboard');
  }).catch((e) => {
    console.log(e);
    res.redirect('/login');
  })
})

router.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('You are not logged in!');
  }

  res.send('You are logged in!');
})

router.get('/logout', (req, res) => {
  res.render('logout');
})

router.post('/logout', (req, res) => {
  if (!req.session.user) {
    return res.status(401).send('You are not logged in!');
  }

  req.session.destroy();
  res.redirect('/dashboard');
})

router.get('/get-data', function(req, res, next) {
  User.find().then(function (doc) {
    res.render('index', {items: doc.email});
  })
});

router.post('/update', function(req, res, next) {
  var id = req.body.id;

  User.findById(id, function (err, doc) {
    if (err) {
      console.log(err);
    }
    doc.title = req.body.title;
    doc.content = req.body.content;
    doc.author = req.body.author;
    doc.save();
  });
  res.redirect('/');
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;
  User.findByIdAndRemove(id).exec();
  res.redirect('/');
});

module.exports = router;
