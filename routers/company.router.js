const router = require('express').Router();
const { getCompanies } = require('../handlers/companyHandler');

router.get('/companies', getCompanies);

module.exports = router;
