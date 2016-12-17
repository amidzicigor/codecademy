const express         = require('express');
const hbs             = require('hbs');
const bodyParser      = require('body-parser');
const _               = require('lodash');

const {mongoose}      = require('./server/db/mongoose');
const {User}          = require('./server/models/user');

const port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.set('view-engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));

// Get home page
app.get('/', (req, res) => {
  res.render('home.hbs');
})

// Get login page
app.get('/login', (req, res) => {
  res.render('login.hbs');
})

// Get signup page
app.get('/signup', (req, res) => {
  res.render('signup.hbs');
})

// -------------------------------------------------------------------------- //

// Post signup page
app.post('/signup', (req, res) => {
  var body = _.pick(req.body, ['email', 'username', 'password']);
  var user = new User(body);

  user.save().then(() => {
    res.render('welcome.hbs', {
      user: `${user.username}`
    })
  }).catch((e) => {
    res.status(400).send(`${e} ############# Please try again!`);
  })
});

// Logging in a user
app.post('/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    res.render('welcome.hbs', {
      user: `${user.username}`
    })
  }).catch((e) => {
    res.status(400).send('Error');
  });
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
})
