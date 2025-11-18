async function nse(req, res) {
  try {
    const { symbol } = req.params;
    let url = `https://www.nseindia.com/api/ipo-active-category?symbol=${symbol}`;

    let response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        Accept: '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
      },
    });
    let obj = {
      qib: 0,
      nibat: 0,
      nibbt: 0,
      retail: 0,
      employee: 0,
    };
    let body = await response.json();

    for (let i = 0; i < body.dataList.length; i++) {
      let dt = body.dataList[i];
      if (dt.category == 'Qualified Institutional Buyers(QIBs)') {
        obj.qib += parseInt(dt.noOfSharesBid);
      } else if (
        dt.category ==
        'Non Institutional Investors(Bid amount of more than Ten Lakh Rupees)'
      ) {
        obj.nibat += parseInt(dt.noOfSharesBid);
      } else if (
        dt.category ==
        'Non Institutional Investors(Bid amount of more than Two Lakh Rupees upto Ten Lakh Rupees)'
      ) {
        obj.nibbt += parseInt(dt.noOfSharesBid);
      } else if (dt.category == 'Retail Individual Investors(RIIs)') {
        obj.retail += parseInt(dt.noOfSharesBid);
      } else if (dt.category == 'Employees') {
        obj.employee += parseInt(dt.noOfSharesBid);
      }
    }
    res.json(obj);
  } catch (err) {
    console.error(err);
    res.status(500).json('internal server error');
  }
}

module.exports = { nse };
