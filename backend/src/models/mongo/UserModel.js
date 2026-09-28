const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true },
  email: { type: String, default: null },
  phone: { type: String, default: null },
  password_hash: { type: String, default: null },
  reset_otp: { type: String, default: null },
  reset_expires: { type: Date, default: null },
  avatar_color: { type: String, default: '#4F46E5' },
  status: { type: String, default: 'offline' },
  last_seen: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now }
}, { timestamps: false, collection: 'users' });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
