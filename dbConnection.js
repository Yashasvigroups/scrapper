const mongoose = require('mongoose');

let connectDb = async () => {
  // waiting for mongo container to start
  await new Promise((res, _) => setTimeout(res, 3000));
  console.log('##################### DB Connection');
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || 'allotment',
    });
    console.log('DB connection established');
  } catch (err) {
    console.log('Failed to connect to db ', err);
  }
};
connectDb();
