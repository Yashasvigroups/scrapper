const puppeteer = require('puppeteer');
const { SCRAP_URL } = require('../static/static');

async function scrap(_, res) {
  const browser = await puppeteer.launch({
    headless: false, // try non-headless first to debug
    // executablePath: '/usr/bin/chromium',
    acceptInsecureCerts: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1280,720',
    ],
  });

  try {
    const [cameo, bigshare, linkin, maashitla, kfintech, skyline] =
      await Promise.all([
        ScrapperCameo(browser),
        ScrapperBigshare(browser),
        ScrapperLinkintime(browser),
        ScrapperMaashitla(browser),
        ScrapperKfintech(browser),
        ScrapperSkyline(browser),
        // ScrapperPurva(browser),
      ]);

    return res.status(200).json({
      data: [
        ...cameo,
        ...bigshare,
        ...linkin,
        ...maashitla,
        ...kfintech,
        ...skyline,
      ],
      message: '',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ data: [], message: 'internal server error' });
  } finally {
    await browser.close();
  }
}

async function ScrapperCameo(browser) {
  const page = await browser.newPage();
  await page.goto(SCRAP_URL.CAMEO);

  const companyCodeMap = await page.evaluate(() => {
    const options = document.querySelectorAll('[name="drpCompany"] option');
    return Array.from(options)
      .slice(1)
      .map((opt) => {
        return {
          companyCode: opt.getAttribute('value'), // you may need to split later
          companyName: opt.innerText.trim(),
          registrar: 'CAMEO',
        };
      });
  });

  console.log('scrapped cameo');
  await page.close();
  return companyCodeMap;
}

async function ScrapperMaashitla(browser) {
  const page = await browser.newPage();
  await page.goto(SCRAP_URL.MAASHITLA);

  const companyCodeMap = await page.evaluate(() => {
    const options = document.querySelectorAll('#txtCompany option');
    return Array.from(options)
      .slice(1)
      .map((opt) => {
        return {
          companyCode: opt.getAttribute('value'), // you may need to split later
          companyName: opt.innerText.trim(),
          registrar: 'MAASHITLA',
        };
      });
  });

  console.log('scrapped maashitla');
  await page.close();
  return companyCodeMap;
}

async function ScrapperBigshare(browser) {
  const page = await browser.newPage();
  await page.goto(SCRAP_URL.BIGSHARE);

  const companyCodeMap = await page.evaluate(() => {
    const options = document.querySelectorAll('#ddlCompany option');
    return Array.from(options).map((opt) => {
      return {
        companyCode: opt.getAttribute('value'), // you may need to split later
        companyName: opt.innerText.trim(),
        registrar: 'BIGSHARE',
      };
    });
  });

  console.log('scrapped bigshare');
  await page.close();
  return companyCodeMap;
}

async function ScrapperLinkintime(browser) {
  // let response = await fetch(SCRAP_URL.LINKINTIME, {
  //   method: 'post',
  //   headers: { 'Content-Type': 'application/json' },
  // });

  // let content = await response.json();
  // let data = xmlParser.parse(content.d);
  // if (data.NewDataSet && data.NewDataSet.Table) {
  //   data = data.NewDataSet.Table;

  //   const companyCodeMap = [];
  //   data?.forEach((entry) => {
  //     companyCodeMap.push({
  //       companyCode: entry.company_id.toString(),
  //       companyName: entry.companyname,
  //       registrar: REGISTRAR.LINKINTIME,
  //     });
  //   });

  //   console.log('scrapped linkintime');
  //   return companyCodeMap;
  // }
  const page = await browser.newPage();
  await page.goto(SCRAP_URL.LINKINTIME);

  const companyCodeMap = await page.evaluate(() => {
    const options = document.querySelectorAll('#ddlCompany option');
    return Array.from(options)
      .slice(1)
      .map((opt) => {
        return {
          companyCode: opt.getAttribute('value'), // you may need to split later
          companyName: opt.innerText.trim(),
          registrar: 'LINKINTIME',
        };
      });
  });

  console.log('scrapped linkintime');
  await page.close();
  return companyCodeMap;
}

async function ScrapperKfintech(browser) {
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  await page.goto(SCRAP_URL.KFINTECH, { waitUntil: 'networkidle2' });

  await page.waitForSelector('.content', { timeout: 30000 });
  // now wait for your input
  await page.waitForSelector('#demo-multiple-name', { timeout: 20000 });
  await page.click('#demo-multiple-name');

  const companyCodeMap = await page.evaluate(() => {
    const options = document.querySelectorAll('#menu- ul li');
    return Array.from(options).map((opt) => ({
      companyCode: opt.getAttribute('data-value'), // you may need to split later
      companyName: opt.innerText.trim(),
      registrar: 'KFINTECH',
    }));
  });

  console.log('scrapped kniftech');
  await page.close();
  return companyCodeMap;
}

async function ScrapperSkyline(browser) {
  const page = await browser.newPage();
  await page.goto(SCRAP_URL.SKYLINE);

  const companyCodeMap = await page.evaluate(() => {
    const options = document.querySelectorAll('#company option');
    return Array.from(options)
      .slice(1)
      .map((opt) => {
        return {
          companyCode: opt.getAttribute('value'), // you may need to split later
          companyName: opt.innerText.trim(),
          registrar: 'SKYLINE',
        };
      });
  });

  console.log('scrapped skyline');
  await page.close();
  return companyCodeMap;
}

// async function ScrapperPurva(browser) {
//   const page = await browser.newPage();
//   await page.goto(SCRAP_URL.PURVA);

//   const companyCodeMap = await page.evaluate(() => {
//     const options = document.querySelectorAll('#company option');
//     return Array.from(options)
//       .slice(1)
//       .map((opt) => {
//         return {
//           companyCode: opt.getAttribute('value'), // you may need to split later
//           companyName: opt.innerText.trim(),
//           registrar: 'SKYLINE',
//         };
//       });
//   });

//   console.log('scrapped skyline');
//   await page.close();
//   return companyCodeMap;
// }

module.exports = { scrap };
