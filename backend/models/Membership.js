const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  // Personal Information
  fullName: { 
    type: String, 
    required: true 
  },
  dateOfBirth: { 
    type: Date, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    lowercase: true,
    trim: true
  },
  phone: { 
    type: String, 
    required: true 
  },
  address: { 
    type: String, 
    required: true 
  },
  city: { 
    type: String, 
    required: true 
  },
  state: { 
    type: String, 
    required: true 
  },
  zipCode: { 
    type: String, 
    required: true 
  },
  country: { 
    type: String, 
    required: true, 
    default: 'USA' 
  },
  
  // Membership Type
  membershipType: {
    type: String,
    required: true,
    enum: ['individual', 'family', 'student', 'senior']
  },
  
  // Emergency Contact
  emergencyContactName: { 
    type: String, 
    required: true 
  },
  emergencyContactPhone: { 
    type: String, 
    required: true 
  },
  emergencyContactRelationship: { 
    type: String, 
    required: true 
  },
  
  // Additional Information
  hearAboutUs: {
    type: String,
    enum: ['friend', 'social-media', 'website', 'event', 'other', '']
  },
  interests: {
    meditation: { type: Boolean, default: false },
    dharma: { type: Boolean, default: false },
    retreats: { type: Boolean, default: false },
    volunteering: { type: Boolean, default: false },
    youth: { type: Boolean, default: false }
  },
  comments: String,
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  consent: { 
    type: Boolean, 
    required: true 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Membership', membershipSchema);