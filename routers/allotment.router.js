const router = require('express').Router();
const { checkAllotments, recheckAllotment } = require('../handlers/checkAllotments');

router.get('/checkAllotments/:companyId', checkAllotments);
router.get('/recheckAllotment/:companyId', recheckAllotment);

module.exports = router;
