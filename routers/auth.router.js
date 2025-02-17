const router = require('express').Router();
const { registerUser } = require('../handlers/registerUser');
const { loginUser } = require('../handlers/loginUser');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
