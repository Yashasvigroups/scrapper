const jwt = require('jsonwebtoken');
const { User } = require('../schema/user.schema');

async function authenticate(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      res.status(401).json({ message: 'unauthorized' });
      return;
    }

    const auth = authorization.split(' ');

    if (auth.length != 2 || !auth[1]) {
      res.status(401).json({ message: 'unauthorized' });
      return;
    }
    let payload = { email: '' };
    try {
      payload = jwt.verify(auth[1], process.env.JWT_SECRET || 'default');
    } catch (err) {
      res.status(401).json({ message: 'unauthorized' });
      return;
    }

    let user = await User.findOne({ email: payload.email });
    if (!user) {
      console.log('Deleted User Token');
      res.status(400).json({ message: 'Please login again' });
      return;
    }

    req.userId = user?._id;

    next();
  } catch (err) {
    console.log('Failed authentication: ', err?.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { authenticate };
