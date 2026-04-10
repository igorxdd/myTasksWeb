const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    trim: true,
    maxlength: 120,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 30,
    default: ''
  },
  bio: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  }
}, {
  timestamps: true
});

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;
