const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  badge: {
    type: String,
    default: 'NEW'
  },
  text: {
    type: String,
    required: [true, 'Please add announcement text'],
    maxlength: [200, 'Announcement cannot be more than 200 characters']
  },
  cta: {
    type: String,
    default: ''
  },
  ctaLink: {
    type: String,
    default: '#'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);
