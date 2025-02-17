const { Schema, model } = require('mongoose');

const UserSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      index: true,
    },
    password: String,
    salt: String,
  },
  { versionKey: false }
);

const User = model('User', UserSchema);
module.exports = { User };
