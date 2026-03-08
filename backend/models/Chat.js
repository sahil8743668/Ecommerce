const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender:   { type: String, enum: ['user', 'admin'], required: true },
  text:     { type: String, required: true },
  read:     { type: Boolean, default: false },
}, { timestamps: true });

const chatSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [messageSchema],
  status:   { type: String, enum: ['open', 'closed'], default: 'open' },
  lastMessage: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
