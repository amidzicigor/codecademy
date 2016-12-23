var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI || 'localhost:27017/codecademy');

module.exports = {mongoose};
