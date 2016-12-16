const express         = require('express');
const hbs             = require('hbs');
const bodyParser      = require('body-parser');
const _               = require('lodash');

// const {mongoose}      = require('./server/db/mongoose');
// const {User}          = require('./server/models/user');
// var {authenticate}    = require('./server/middleware/authenticate');

const port = process.env.PORT || 3000;

var app = express();

// app.use(bodyParser.urlencoded({
//   extended: true
// }));
// app.use(bodyParser.json());
app.set('view-engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));

// Get home page
app.get('/', (req, res) => {
  res.render('home.hbs');
})

// Get login page
app.get('/login', (req, res) => {
  res.render('login.hbs', {
    pageTitle: 'Login'
  });
})

// Get signup page
app.get('/signup', (req, res) => {
  res.render('signup.hbs', {
    pageTitle: 'Signup'
  });
})

// -------------------------------------------------------------------------- //

// Post signup page
// app.post('/signup', (req, res) => {
//   var body = _.pick(req.body, ['firstName', 'lastName', 'email', 'password']);
//   var user = new User(body);
//
//   user.save().then(() => {
//     return user.generateAuthToken();
//   }).then((token) => {
//     res.header('x-auth', token).render('welcome.hbs', {
//       user: `${user.firstName} ${user.lastName}`
//     })
//   }).catch((e) => {
//     res.status(400).send(`${e} ############# Please try again!`);
//   })
// });
//
// // Logging in a user
// app.post('/login', (req, res) => {
//   var body = _.pick(req.body, ['email', 'password']);
//
//   User.findByCredentials(body.email, body.password).then((user) => {
//     return user.generateAuthToken().then((token) => {
//       res.header('x-auth', token).render('welcome.hbs', {
//         user: `${user.firstName} ${user.lastName}`
//       });
//     });
//   }).catch((e) => {
//     res.status(400).send('Some error in user.js line 91');
//   });
// });
//
// app.delete('/logout', authenticate, (req, res) => {
//   req.user.removeToken(req.token).then(() => {
//     res.status(200).send('Logged out');
//   }, () => {
//     res.status(400).send('Some error');
//   })
// })

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
})
