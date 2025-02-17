const express = require('express');
require('dotenv').config();
// routers
const authRouter = require('./routers/auth.router');
const panRouter = require('./routers/pan.router');
const allotmentRouter = require('./routers/allotment.router');
const { getGreyProfit } = require('./handlers/getGreyProfit');

// auth middleware
const { authenticate } = require('./middlewares/auth');

// database connection
require('./dbConnection');

// for allowing expired tls certificates on 3rd class registrar sites
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const app = express();
app.use(express.json());

app.use(authRouter);
// auth middleware
app.use(authenticate);
app.use('/pan', panRouter);
app.use('/', allotmentRouter);
app.get('/getGreyProfit', getGreyProfit);

app.listen(process.env.PORT || 3000, (err, _) => {
  if (err) {
    console.log('Error initiating server');
    return;
  }
  console.log('Server listening on 3000');
});
