const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,  // or the appropriate type for your use case
    required: true,
  },
  image: String,  // or the appropriate type for your use case
});

const User = mongoose.model('User', userSchema);

module.exports = User;
