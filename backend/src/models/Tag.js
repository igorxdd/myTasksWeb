const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 40
  },
  color: {
    type: String,
    trim: true,
    default: '#3B82F6'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

tagSchema.index({ user: 1, name: 1 }, { unique: true });

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;
