const Message = require('../models/Message');

exports.getChatPage = async (req, res) => {
  try {

    const messages = await Message.find().sort({ createdAt: 1 });


    res.render('chat', { messages });
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).send('Internal Server Error');
  }
};

exports.postMessage = async (req, res) => {
  try {
    const { sender, content } = req.body;


    const newMessage = new Message({
      sender,
      content,
    });

 
    await newMessage.save();

    res.redirect('/chat');
  } catch (error) {
    console.error('Error posting message:', error);
    res.status(500).send('Internal Server Error');
  }
};
