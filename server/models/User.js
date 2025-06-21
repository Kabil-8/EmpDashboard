const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  department: String,
  gender: String,
  mode: String,
  salary: Number,
  score: Number
});

module.exports = mongoose.model('User', UserSchema);
