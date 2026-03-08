const asyncHandler = require('express-async-handler');
const Chat = require('../models/Chat');

exports.getMyChat = asyncHandler(async (req, res) => {
  let chat = await Chat.findOne({ user: req.user._id });
  if (!chat) chat = await Chat.create({ user: req.user._id });
  res.json({ success: true, chat });
});

exports.sendMessage = asyncHandler(async (req, res) => {
  const { text } = req.body;
  let chat = await Chat.findOne({ user: req.user._id });
  if (!chat) chat = await Chat.create({ user: req.user._id });
  chat.messages.push({ sender: 'user', text });
  chat.lastMessage = Date.now();
  await chat.save();
  // Emit via socket (handled in server.js)
  req.app.get('io')?.to('admin').emit('new_message', { chatId: chat._id, message: { sender: 'user', text } });
  res.json({ success: true, message: chat.messages[chat.messages.length - 1] });
});

exports.adminReply = asyncHandler(async (req, res) => {
  const { text, chatId } = req.body;
  const chat = await Chat.findById(chatId);
  if (!chat) { res.status(404); throw new Error('Chat not found'); }
  chat.messages.push({ sender: 'admin', text });
  chat.lastMessage = Date.now();
  await chat.save();
  req.app.get('io')?.to(chat.user.toString()).emit('admin_reply', { text });
  res.json({ success: true });
});

exports.getAllChats = asyncHandler(async (req, res) => {
  const chats = await Chat.find({ status: 'open' }).populate('user', 'name email').sort('-lastMessage');
  res.json({ success: true, chats });
});

exports.closeChat = asyncHandler(async (req, res) => {
  await Chat.findByIdAndUpdate(req.params.id, { status: 'closed' });
  res.json({ success: true, message: 'Chat closed' });
});
