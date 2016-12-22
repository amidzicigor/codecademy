var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: {
    type: String,
    trim: true,
    minLength: 1,
    unique: true
  },
  username: {
    type: String,
    trim: true,
    minLength: 1,
    unique: true
  },
  password: {
    type: String,
    minLength: 6
  }
}, {collection: 'user-data'});

var User = mongoose.model('User', userSchema);

module.exports = {User}
