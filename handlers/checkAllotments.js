const Papa = require('papaparse');
const { REGISTRAR } = require('../static/static');
const { Company } = require('../schema/company.schema');
const { Allocation } = require('../schema/allocation.schema');
const { checkPanWithBigshare } = require('./helpers/bigshare');
const { checkPanWithCameo } = require('./helpers/cameo');
const { checkPanWithLinkintime } = require('./helpers/linkintime');
const { checkPanWithMaashitla } = require('./helpers/maashitla');
const { checkPanWithKifntech } = require('./helpers/kfintech');
const { Types } = require('mongoose');

async function checkAllotments(req, res) {
  try {
    const { companyId } = req.params;
    const file = req.file;

    if (!companyId) {
      res.status(400).json({ message: 'enter company to check allotment for' });
      return;
    }
    if (!file) {
      res.status(400).json({ message: 'please upload a csv file with pans' });
      return;
    }
    if (!Types.ObjectId.isValid(companyId)) {
      res.status(400).json({ message: 'please enter valid companyId' });
      return;
    }

    // checking company if exists
    const content = Papa.parse(file.buffer.toString(), { header: false });
    const pans = content.data
      .map((ele) => ele[0])
      .filter((pan) => check10Length(pan));
    if (!pans || pans.length == 0) {
      res.status(400).json({
        message:
          'empty csv file or unable to parse please enter valid csv syntax',
      });
      return;
    }
    const company = await Company.findOne({ _id: companyId }).lean();
    if (!company) {
      res.status(400).json({ message: 'could not find the company' });
      return;
    }

    // getting all already existsing pans result
    let response = await Allocation.find(
      { panNumber: { $in: pans }, companyId: companyId },
      { result: 1, _id: 0, panNumber: 1 }
    )
      .sort({ panNumber: 1 })
      .lean();

    // creating set to efficiently check the pans not in result set
    let givenPans = new Set(pans);
    let foundPans = new Set(response.map((ele) => ele.panNumber));

    // list for pans to get results for from site
    let diffPans = [];
    givenPans.forEach((pan) => {
      if (!foundPans.has(pan)) {
        diffPans.push({ panNumber: pan });
      }
    });

    let newEntries = await fetchFromWebsite(company, diffPans);
    let saveToDBCalls = newEntries.map((entry) => {
      Allocation.updateOne(
        {
          companyId: company._id,
          panNumber: entry.panNumber,
          result: entry.result,
        },
        { upsert: true }
      );
    });
    try {
      await Promise.all(saveToDBCalls);
    } catch (err) {
      console.log(err);
    }
    response = response.concat(newEntries);

    res.status(200).json(response);
  } catch (err) {
    console.log('Failed checking allotment: ', err?.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function recheckAllotment(req, res) {
  const { companyId } = req.params;
  let { pans } = req.body;

  if (!companyId || !pans || pans.length == 0) {
    res.status(400).json({ message: 'enter company to check allotment for' });
    return;
  }

  if (!Types.ObjectId.isValid(companyId)) {
    res.status(400).json({ message: 'please enter valid companyId' });
    return;
  }

  const company = await Company.findOne({ _id: companyId }).lean();
  if (!company) {
    res.status(400).json({ message: 'could not find the company' });
    return;
  }

  pans = pans
    .filter((pan) => check10Length(pan))
    .map((pan) => ({ panNumber: pan }));
  let newEntries = await fetchFromWebsite(company, pans);

  if (newEntries.length == 1 && newEntries[0].result) {
    await Allocation.updateOne(
      { panNumber: newEntries[0].panNumber, companyId: company._id },
      { result: newEntries[0].result },
      { upsert: true }
    );
  }

  res.status(200).json(newEntries);
}

async function checkBatchAllotment(req, res) {
  let { pans, companyCode, registrar } = req.body;
  if (!companyCode || !pans || pans.length == 0 || !registrar) {
    res.status(400).json({ message: 'bad request need all the fields' });
    return;
  }
  registrar = registrar.toUpperCase();
  if (
    [
      REGISTRAR.CAMEO,
      REGISTRAR.MAASHITLA,
      REGISTRAR.BIGSHARE,
      REGISTRAR.LINKINTIME,
      REGISTRAR.KFINTECH,
    ].findIndex((r) => r == registrar) == -1
  ) {
    res.status(400).json({ message: 'bad registrar' });
    return;
  }
  // []string to []{panNumber: string}
  pans = pans
    .filter((pan) => check10Length(pan))
    .map((pan) => ({ panNumber: pan }));
  let newEntries = await fetchFromWebsite2(companyCode, pans, registrar);
  return res.status(200).json(newEntries);
}

async function fetchFromWebsite(company, panNumbers) {
  // for the pans which are not yet in allocated
  let resultMap = {};
  switch (company?.registrar) {
    case REGISTRAR.CAMEO:
      resultMap = await checkPanWithCameo(companyCode, panNumbers);
      break;
    case REGISTRAR.MAASHITLA:
      resultMap = await checkPanWithMaashitla(companyCode, panNumbers);
      break;
    case REGISTRAR.BIGSHARE:
      resultMap = await checkPanWithBigshare(companyCode, panNumbers);
      break;
    case REGISTRAR.LINKINTIME:
      resultMap = await checkPanWithLinkintime(companyCode, panNumbers);
      break;
    case REGISTRAR.KFINTECH:
      resultMap = await checkPanWithKifntech(companyCode, panNumbers);
      break;
    default:
      break;
  }

  const response = [];

  Object.keys(resultMap).forEach((k) => {
    // add to result
    response.push({
      panNumber: k,
      result: resultMap[k],
    });
  });

  return response;
}

async function fetchFromWebsite2(companyCode, panNumbers, registrar) {
  // for the pans which are not yet in allocated
  let resultMap = {};
  switch (registrar) {
    case REGISTRAR.CAMEO:
      resultMap = await checkPanWithCameo(companyCode, panNumbers);
      break;
    case REGISTRAR.MAASHITLA:
      resultMap = await checkPanWithMaashitla(companyCode, panNumbers);
      break;
    case REGISTRAR.BIGSHARE:
      resultMap = await checkPanWithBigshare(companyCode, panNumbers);
      break;
    case REGISTRAR.LINKINTIME:
      resultMap = await checkPanWithLinkintime(companyCode, panNumbers);
      break;
    case REGISTRAR.KFINTECH:
      resultMap = await checkPanWithKifntech(companyCode, panNumbers);
      break;
    default:
      break;
  }

  const response = [];

  Object.keys(resultMap).forEach((k) => {
    // add to result
    response.push({
      panNumber: k,
      result: resultMap[k],
    });
  });

  return response;
}

async function check10Length(pan) {
  return pan?.trim()?.length === 10;
}

module.exports = { checkAllotments, recheckAllotment, checkBatchAllotment };
