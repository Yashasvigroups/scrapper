const axios = require('axios');
const { STATUS, REGISTRAR, SCRAP_URL } = require('../static/static');
const { Company } = require('../schema/company.schema');
const { Pan } = require('../schema/panCards.schema');
const { XMLParser } = require('fast-xml-parser');
// single instance
const xmlParser = new XMLParser();

async function checkAllotments(req, res) {
  try {
    const { companyId } = req.params;
    if (!companyId) {
      res.status(400).json({ message: 'enter company to check allotment for' });
      return;
    }

    const company = await Company.findOne({ _id: companyId });
    if (!company) {
      res.status(400).json({ message: 'could not find the company' });
      return;
    }

    const userPans = await Pan.find(
      { userId: req.userId },
      { panNumber: 1, _id: 0 }
    );
    let response = {};
    if (userPans.length == 0) {
      res.status(200).json(response);
      return;
    }

    switch (company?.registrar) {
      case REGISTRAR.CAMEO:
        response = await checkPanWithCameo(company, userPans);
        break;
      case REGISTRAR.MAASHITLA:
        response = await checkPanWithMaashitla(company, userPans);
        break;
      case REGISTRAR.BIGSHARE:
        response = await checkPanWithBigshare(company, userPans);
        break;
      case REGISTRAR.LINKINTIME:
        response = await checkPanWithLinkintime(company, userPans);
        break;
      default:
        break;
    }

    res.status(200).json(response);
  } catch (err) {
    console.log('Failed checking allotment: ', err?.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

// Helper functions to check allotments
async function checkPanWithCameo(company, pans) {
  try {
    let calls = [];
    for (let i = 0; i < pans.length; ++i) {
      calls.push(
        axios.post(SCRAP_URL.CAMEO, {
          code: company.companyCode,
          type: 'pan',
          value: pans[i].panNumber,
        })
      );
    }

    let results = await Promise.allSettled(calls);

    // check for alloted, not applied, not alloted
    const res = {};
    results.forEach((response, index) => {
      let panNumber = pans[index].panNumber;

      if (response.status == 'rejected') {
        console.log(`rejected for pan ${panNumber}`);
        res[panNumber] = STATUS.NOT_APPLIED;
        return;
      }

      if (!response.value || !response.value.data) {
        console.log(`empty response for pan ${panNumber}`);
        res[panNumber] = STATUS.NOT_APPLIED;
        return;
      }

      let data = response.value.data;

      if (data.length == 0) {
        res[panNumber] = STATUS.NOT_APPLIED;
      } else {
        if (data[0].refundAmount > 0 && data[0].allotedShares == 0) {
          res[panNumber] = STATUS.NOT_ALLOTED;
        } else if (data[0].allotedShares > 0) {
          res[panNumber] = data[0].allotedShares + STATUS.ALLOTED;
        }
      }
    });

    return res;
  } catch (err) {
    console.log('while checking allotment', err);
    throw new Error('Something went wrong while checking allotment');
  }
}

async function checkPanWithMaashitla(company, pans) {
  try {
    let calls = [];
    for (let i = 0; i < pans.length; ++i) {
      calls.push(
        axios.get(
          `${SCRAP_URL.MAASHITLA}?company=${company.companyCode}&search=${pans[i].panNumber}`
        )
        // gb_logistics_commerce_limited
      );
    }

    let results = await Promise.allSettled(calls);

    // check for alloted, not applied, not alloted
    const res = {};
    results.forEach((response, index) => {
      let panNumber = pans[index].panNumber;

      if (response.status == 'rejected') {
        console.log(`rejected for pan ${panNumber}`);
        res[panNumber] = STATUS.NOT_APPLIED;
        return;
      }

      if (!response.value || !response.value.data) {
        console.log(`empty response for pan ${panNumber}`);
        res[panNumber] = STATUS.NOT_APPLIED;
        return;
      }

      let data = response.value.data;

      if (!data || (data.share_Applied == 0 && data.share_Alloted == 0)) {
        res[panNumber] = STATUS.NOT_APPLIED;
      } else if (data.share_Applied > 0) {
        if (data.share_Alloted == 0) {
          res[panNumber] = STATUS.NOT_ALLOTED;
        } else if (data.share_Alloted > 0) {
          res[panNumber] = data.share_Alloted + STATUS.ALLOTED;
        }
      }
    });

    return res;
  } catch (err) {
    console.log('while checking allotment', err);
    throw new Error('Something went wrong while checking allotment');
  }
}

async function checkPanWithBigshare(company, pans) {
  try {
    let calls = [];
    for (let i = 0; i < pans.length; ++i) {
      calls.push(
        axios.post(SCRAP_URL.BIGSHARE, {
          Company: company.companyCode,
          PanNo: pans[i].panNumber,
          SelectionType: 'PN',
          ddlType: '0',
          Applicationno: '',
          txtcsdl: '',
          txtDPID: '',
          txtClId: '',
        })
      );
    }

    let results = await Promise.allSettled(calls);

    // check for alloted, not applied, not alloted
    const res = {};
    results.forEach((response, index) => {
      let panNumber = pans[index].panNumber;
      if (response.status == 'rejected') {
        console.log(`rejected for pan ${panNumber}`);
        res[panNumber] = STATUS.NOT_APPLIED;
        return;
      }

      if (!response.value || !response.value.data || !response.value.data.d) {
        console.log(`empty response for pan ${pans[index].panNumber}`);
        res[pans[index].panNumber] = STATUS.NOT_APPLIED;
        return;
      }

      let data = response.value.data.d;

      if (data.APPLIED == '' && data.ALLOTED == '') {
        res[panNumber] = STATUS.NOT_APPLIED;
      } else {
        if (parseInt(data.APPLIED) > 0 && data.ALLOTED == 'NON-ALLOTTE') {
          res[panNumber] = STATUS.NOT_ALLOTED;
        } else if (parseInt(data.ALLOTED) > 0) {
          res[panNumber] = data.ALLOTED + STATUS.ALLOTED;
        }
      }
    });

    return res;
  } catch (err) {
    console.log('while checking allotment', err);
    throw new Error('Something went wrong while checking allotment');
  }
}

async function checkPanWithLinkintime(company, pans) {
  try {
    let calls = [];
    for (let i = 0; i < pans.length; ++i) {
      calls.push(
        axios.post(SCRAP_URL.LINKINTIME, {
          clientid: company.companyCode,
          PAN: pans[i].panNumber,
          CHKVAL: '1',
          IFSC: '',
          token: '',
        })
      );
    }

    let results = await Promise.allSettled(calls);

    // check for alloted, not applied, not alloted
    const res = {};
    results.forEach((response, index) => {
      let panNumber = pans[index].panNumber;

      if (response.status == 'rejected') {
        console.log(`rejected for pan ${panNumber}`);
        res[panNumber] = STATUS.NOT_APPLIED;
        return;
      }

      if (!response.value || !response.value.data || !response.value.data.d) {
        console.log(`empty response for pan ${pans[index].panNumber}`);
        res[pans[index].panNumber] = STATUS.NOT_APPLIED;
        return;
      }

      let data = response.value.data.d;
      data = xmlParser.parse(data).NewDataSet;
      if (data == '') res[panNumber] = STATUS.NOT_APPLIED;
      else {
        data = data.Table;
        if (data.SHARES > 0 && data.ALLOT == 0) {
          res[panNumber] = STATUS.NOT_ALLOTED;
        } else if (data.ALLOT > 0) {
          res[panNumber] = data.ALLOT + STATUS.ALLOTED;
        }
      }
    });

    return res;
  } catch (err) {
    console.log('while checking allotment', err);
    throw new Error('Something went wrong while checking allotment');
  }
}

module.exports = { checkAllotments };
