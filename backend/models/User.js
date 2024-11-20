const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    immutable: true
  },
  displayName: {
    type: String,
    required: true,
    default: function() {
      return this.username;
    }
  },
  email: { 
    type: String, 
    required: true, 
    unique: true
  },
  password: { 
    type: String, 
    required: true 
  },
  bio: {
    type: String,
    default: '',
    maxLength: 500
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);