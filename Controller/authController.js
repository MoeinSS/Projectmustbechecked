const User = require('../Models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { name, email, password, mobileNumber } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
    });
    await user.save();
    res.redirect('/login');
  } catch (error) {
    console.error('Error registering user:', error);
    res.redirect('/register');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.redirect('/login');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.redirect('/login');
    }
    req.session.user = user;
    res.redirect('/chat');
  } catch (error) {
    console.error('Error logging in user:', error);
    res.redirect('/login');
  }
};
