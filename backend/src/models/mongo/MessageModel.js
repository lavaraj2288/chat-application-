const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  sender_id: { type: String, required: true, index: true },
  sender_name: { type: String, required: true },
  receiver_id: { type: String, default: null, index: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
  status: { type: String, default: 'sent' }
}, { timestamps: false, collection: 'messages' });

module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);
