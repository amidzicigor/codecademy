var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
var bcrypt          = require('bcrypt-nodejs');

var userSchema = new Schema({
    name: {
      type: String,
      trim: true,
      default: ''
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      minLength: 1,
      unique: true,
      required: true
    },
    username: {
      type: String,
      trim: true
    },
    password: {
      type: String,
      minLength: 6,
      required: true
    },
    location: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: 'English'
    },
    aboutMe: {
      type: String,
      time: true,
      default: ''
    },
    website: {
      type: String,
      trim: true,
      default: ''
    },
    gitHub: {
      type: String,
      trim: true,
      default: ''
    },
    twitter: {
      type: String,
      trim: true,
      default: ''
    },
    linkedinURL: {
      type: String,
      trim: true,
      default: ''
    },
    profilePicture: {
      type: String,
      default: 'img/userImg.jpg'
    },


  // },
  // facebook: {
  //   id: String,
  //   token: String,
  //   email: String,
  //   name: String
  // }
});

userSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}

var User = mongoose.model('User', userSchema);

module.exports = {User}
