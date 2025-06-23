const router = require('express').Router();
const {
  checkAllotments,
  recheckAllotment,
  checkBatchAllotment,
} = require('../handlers/checkAllotments');
const { fileHandler } = require('../middlewares/fileHandler');

router.post(
  '/checkAllotments/:companyId',
  fileHandler.single('file'),
  checkAllotments
);
router.post('/recheckAllotment/:companyId', recheckAllotment);
router.post('/checkBatch', checkBatchAllotment);

module.exports = router;
