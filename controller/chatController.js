const User = require('../models/User');
const Message = require('../models/Message');

exports.chat = async (req, res) => {
  try {
    const users = await User.find().select('_id name');
    const currentUser = req.session.user;
    res.render('chat', { users, currentUser });
  } catch (error) {
    console.error('Error loading chat:', error);
    res.redirect('/login');
  }
};

exports.postMessage = async (req, res) => {
  try {
    const { recipientId, message } = req.body;
    const senderId = req.session.user._id;

    const newMessage = new Message({
      sender: senderId,
      recipient: recipientId,
      message,
    });
    await newMessage.save();

    res.redirect('/chat');
  } catch (error) {
    console.error('Error sending message:', error);
    res.redirect('/chat');
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const senderId = req.session.user._id;

    const messages = await Message.find({
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: recipientId, recipient: senderId },
      ],
    });

    res.render('messages', { messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.redirect('/chat');
  }
};

exports.pollMessages = async (req, res) => {
  try {
    const { recipientId } = req.params;
    const senderId = req.session.user._id;

    const messages = await Message.find({
      $or: [
        { sender: senderId, recipient: recipientId },
        { sender: recipientId, recipient: senderId },
      ],
    });

    res.json(messages);
  } catch (error) {
    console.error('Error polling messages:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
};
