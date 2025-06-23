const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../schema/user.schema');

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).lean();

    if (!user) {
      res.status(404).json({ message: 'User not registered' });
      return;
    }

    if (!bcrypt.compareSync(password, user.password || '')) {
      res.status(401).json({ message: 'Password does not match' });
      return;
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'default', {
      expiresIn: '24h',
    });

    res.status(200).json({ message: 'success', token });
  } catch (err) {
    console.log('Failed login: ', err?.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { loginUser };
