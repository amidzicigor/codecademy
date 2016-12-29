var passport              = require('passport');
var {User}                = require('../server/models/user');
var LocalStrategy         = require('passport-local').Strategy;
var FacebookStrategy      = require('passport-facebook').Strategy;
var configFacebookAuth    = require('./facebookAuth');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Local signup strategy
passport.use('local.signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, email, password, done) {
  req.checkBody('email', 'Invalid email').notEmpty().isEmail();
  req.checkBody('password', 'Password must be atleast 6 characters').isLength({min: 6});
  var username = req.body.username;
  var errors = req.validationErrors();
  if (errors) {
    var messages = [];
    errors.forEach(function (error) {
      messages.push(error.msg);
    });
    return done(null, false, req.flash('error', messages))
  }
  User.findOne({$or:[{'username': username}, {'email': email}]}, function (err, user) {
    if (err) {
      return done(err);
    }
    if (user) {
      if (user.email === email) {
        return done(null, false, {message: 'Email already exists.'})
      } else if (user.username === username) {
        return done(null, false, {message: 'Username already exists.'})
      } else {
        return done(null, false, {message: 'User already exists.'})
      }
    }
    var newUser = new User();
    newUser.email = email;
    newUser.username = username;
    newUser.password = newUser.encryptPassword(password);
    newUser.save(function (err, result) {
      if (err) {
        return done(err);
      }
      req.session.user = newUser;
      return done(null, newUser);
    });
  });
}));

// Local login strategy
passport.use('local.login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, email, password, done) {
    User.findOne({'username': email}, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        console.log('No user found');
        return done(null, false, {message: 'Email does not exist'})
      }
      if (!user.validPassword(password)) {
        console.log('Incorrect password');
        return done(null, false, {message: 'Incorrect password'})
      }
      req.session.user = user;
      return done(null, user);
    });
  }
));

// Facebook signup strategy
// passport.use(new FacebookStrategy({
//     clientID: configFacebookAuth.facebookAuth.clientID,
//     clientSecret: configFacebookAuth.facebookAuth.clientSecret,
//     profileFields: ['id', 'displayName', 'email'],
//     callbackURL: configFacebookAuth.facebookAuth.callbackURL
//   },
//   function(accessToken, refreshToken, profile, done) {
//     console.log(profile)
//     process.nextTick(function () {
//       User.findOne({'facebook.id': profile.id}, function (err, user) {
//         if (err) {
//           return done(err);
//         }
//         if (user) {
//           return done(null, user);
//         }
//         else {
//           var newUser = new User();
//           newUser.facebook.id = profile.id;
//           newUser.facebook.token = accessToken;
//           newUser.facebook.name = profile.displayName;
//           newUser.facebook.email = profile.emails[0].value;
//
//           newUser.save(function (err) {
//             if (err) {
//               throw err;
//             }
//             return done(null, newUser);
//           })
//         }
//       })
//     });
//   }
// ));
