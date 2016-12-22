var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('localhost:27017/codecademy');

module.exports = {mongoose};
