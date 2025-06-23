const { XMLParser } = require('fast-xml-parser');
const axios = require('axios');
const { SCRAP_URL } = require('../../static/static');

const xmlParser = new XMLParser();

async function checkPanWithLinkintime(companyCode, pans) {
  try {
    let calls = [];
    for (let i = 0; i < pans.length; ++i) {
      if (pans[i].panNumber) {
        calls.push(
          axios.post(SCRAP_URL.LINKINTIME, {
            clientid: companyCode,
            PAN: pans[i].panNumber,
            CHKVAL: '1',
            IFSC: '',
            token: '',
          })
        );
      }
    }

    let results = await Promise.allSettled(calls);

    // check for alloted, not applied, not alloted
    const res = {};
    results.forEach((response, index) => {
      let panNumber = pans[index].panNumber;

      if (response.status == 'rejected') {
        console.log(`rejected for pan ${panNumber}`);
        // res[panNumber] = STATUS.NOT_APPLIED;
        res[panNumber] = 'NOT FOUND';
        return;
      }

      if (!response.value || !response.value.data || !response.value.data.d) {
        console.log(`empty response for pan ${pans[index].panNumber}`);
        // res[pans[index].panNumber] = STATUS.NOT_APPLIED;
        res[pans[index].panNumber] = 'NOT FOUND';
        return;
      }

      let data = response.value.data.d;
      data = xmlParser.parse(data).NewDataSet;
      // if (data == "") res[panNumber] = STATUS.NOT_APPLIED;
      if (data == '') res[panNumber] = 'NOT FOUND';
      else {
        data = data.Table;
        if (data.SHARES > 0 && data.ALLOT == 0) {
          // res[panNumber] = STATUS.NOT_ALLOTED;
          res[panNumber] = 0;
        } else if (data.ALLOT > 0) {
          res[panNumber] = data.ALLOT;
        }
      }
    });

    return res;
  } catch (err) {
    console.log('while checking allotment', err);
    throw new Error('Something went wrong while checking allotment');
  }
}

module.exports = { checkPanWithLinkintime };
