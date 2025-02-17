const { Schema, model } = require('mongoose');

const CompanySchema = new Schema(
  {
    companyName: String,
    companyCode: {
      type: String,
      index: true,
    },
    registrar: String,
  },
  { versionKey: false }
);

const Company = model('Company', CompanySchema);
module.exports = { Company };
