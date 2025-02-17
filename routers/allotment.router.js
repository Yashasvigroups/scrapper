const router = require('express').Router();
const { checkAllotments } = require('../handlers/checkAllotments');

router.get('/checkAllotments/:companyId', checkAllotments);

module.exports = router;
