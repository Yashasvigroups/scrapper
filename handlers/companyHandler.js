const { Company } = require("../schema/company.schema");

async function getCompanies(req, res) {
  try {
    let companies = await Company.find({}).sort({ companyName: 1 }).lean();
    res.status(200).json({ companies });
  } catch (err) {
    console.log("Failed get companies: ", err?.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { getCompanies };
