const { Schema, model } = require("mongoose");

const AllocationSchema = new Schema(
  {
    panNumber: {
      type: String,
    },
    companyId: {
      type: String,
    },
    result: {
      type: String,
    },
  },
  { versionKey: false }
);

AllocationSchema.index({ panNumber: 1, companyId: 1 }, { unique: true });
const Allocation = model("Allocation", AllocationSchema);
module.exports = { Allocation };
