const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50 // Example max length
  },
  age: {
    type: Number,
    required: true,
    min: 15,
    max: 99 // Example age range
  },
  address: {
    type: String,
    required: true
  },
  // image: String, 
});
const Student = mongoose.model('student', studentSchema);

module.exports = Student;