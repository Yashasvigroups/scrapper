const router = require('express').Router();
const { getPANs, addPAN, deletePAN } = require('../handlers/panHandlers');

router.get('/', getPANs);
router.post('/', addPAN);
router.delete('/', deletePAN);

module.exports = router;
