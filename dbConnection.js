const mongoose = require("mongoose");

let connectDb = async () => {
  await new Promise((res, _) => setTimeout(res, 3000));
  console.log("##################### DB Connection");

  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || "allotment",
    })
    .then(() => {
      console.log("DB connection established");
    })
    .catch((err) => {
      console.log("Failed to connect to db ", err);
    });
};
connectDb();
