const express = require('express');
const cors = require('cors');
require('dotenv').config();
// routers
const { scrap: chittorgrah } = require('./scrapper/chittorgrah');
const { scrap: companyCodes } = require('./scrapper/companyCode');

// database connection
// require('./dbConnection');

// for allowing expired tls certificates on 3rd class registrar sites
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/scrap/:title/:id', chittorgrah);
app.get('/company-codes', companyCodes);

app.listen(process.env.PORT || 3000, (err, _) => {
  if (err) {
    console.log('Error initiating server');
    return;
  }
  console.log(`Server listening on ${process.env.PORT || 3000}`);
});
