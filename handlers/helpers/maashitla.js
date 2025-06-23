const axios = require('axios');
const { SCRAP_URL } = require('../../static/static');

async function checkPanWithMaashitla(companyCode, pans) {
  try {
    let calls = [];
    for (let i = 0; i < pans.length; ++i) {
      if (pans[i].panNumber) {
        calls.push(
          axios.get(
            `${SCRAP_URL.MAASHITLA}?company=${companyCode}&search=${pans[i].panNumber}`
          )
          // gb_logistics_commerce_limited
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
        res[panNumber] = -1;
        return;
      }

      if (!response.value || !response.value.data) {
        console.log(`empty response for pan ${panNumber}`);
        res[panNumber] = -1;
        return;
      }

      let data = response.value.data;

      if (!data || (data.share_Applied == 0 && data.share_Alloted == 0)) {
        res[panNumber] = -1;
      } else if (data.share_Applied > 0) {
        if (data.share_Alloted == 0) {
          res[panNumber] = 0;
        } else if (data.share_Alloted > 0) {
          res[panNumber] = data.share_Alloted;
        }
      }
    });

    return res;
  } catch (err) {
    console.log('while checking allotment', err);
    throw new Error('Something went wrong while checking allotment');
  }
}

module.exports = { checkPanWithMaashitla };
