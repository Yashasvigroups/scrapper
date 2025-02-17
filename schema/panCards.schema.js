const { Schema, model } = require('mongoose');

const PanSchema = new Schema(
  {
    panNumber: {
      type: String,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { versionKey: false }
);

const Pan = model('Pan', PanSchema);
module.exports = { Pan };
