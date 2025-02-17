const bcrypt = require('bcrypt');
const { User } = require('../schema/user.schema');

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    const isRegistered = await User.countDocuments({ email });

    if (isRegistered > 0) {
      res.status(409).json({ message: 'Email already registered' });
      return;
    }

    let encryptedPassword = bcrypt.hashSync(password, 10);
    await User.create({ email, name, password: encryptedPassword });

    res.status(201).json({ message: 'User registered success' });
  } catch (err) {
    console.log('Failed register: ', err?.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { registerUser };
