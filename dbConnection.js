const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "production") {
  mongoose
    .connect(process.env.MONGO_URI || "mongodb://localhost:27017/admin", {
      dbName: process.env.DB_NAME || "ipo",
      auth: {
        username: process.env.DB_USER || "admin",
        password: process.env.DB_PASSWORD || "password",
      },
    })
    .then(() => {
      console.log("DB connection established");
    })
    .catch((err) => {
      console.log("Failed to connect to db ", err);
    });
} else {
  mongoose
    .connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME })
    .then(() => {
      console.log("DB connection established");
    })
    .catch((err) => {
      console.log("Failed to connect to db ", err);
    });
}
