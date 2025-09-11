const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const { SCRAP_URL } = require('./static/static');
const { XMLParser } = require('fast-xml-parser');
const xmlParser = new XMLParser();

async function ScrapperCameo() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let res = await page.goto(SCRAP_URL.CAMEO);

  let content = (await res?.text()) || '';
  const $ = cheerio.load(content);
  let options = $('[name="drpCompany"]').children();

  const companyCodeMap = {};
  for (let i = 1; i < options.length; ++i) {
    companyCodeMap[options[i].attribs.value] = options[i].children[0]?.data;
  }

  console.log('scrapped cameo');
  await browser.close();
  return companyCodeMap;
}

async function ScrapperMaashitla() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let res = await page.goto(SCRAP_URL.MAASHITLA);

  let content = (await res?.text()) || '';
  const $ = cheerio.load(content);
  let options = $('[id="txtCompany"]').children();

  const companyCodeMap = {};
  for (let i = 1; i < options.length; ++i) {
    companyCodeMap[options[i].attribs.value] = options[i].children[0]?.data;
  }

  console.log('scrapped maashitla');

  await browser.close();
  return companyCodeMap;
}

async function ScrapperBigshare() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let res = await page.goto(SCRAP_URL.BIGSHARE);

  let content = (await res?.text()) || '';
  const $ = cheerio.load(content);
  let options = $('[id="ddlCompany"]').children();

  const companyCodeMap = {};
  for (let i = 1; i < options.length; ++i) {
    companyCodeMap[options[i].attribs.value] = options[i].children[0]?.data;
  }

  console.log('scrapped bigshare');

  await browser.close();
  return companyCodeMap;
}

async function ScrapperLinkintime() {
  let response = await fetch(SCRAP_URL.LINKINTIME, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  let content = await response.json();
  let data = xmlParser.parse(content.d);
  if (data.NewDataSet && data.NewDataSet.Table) {
    data = data.NewDataSet.Table;

    const companyCodeMap = {};
    data?.forEach((entry) => {
      companyCodeMap[entry.company_id] = entry.companyname;
    });

    console.log('scrapped linkintime');
    return companyCodeMap;
  }
}

async function ScrapperKfintech() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let res = await page.goto(SCRAP_URL.KFINTECH);

  let content = (await res?.text()) || '';
  const $ = cheerio.load(content);
  let options = $('[id="ddl_ipo"]').children();

  const companyCodeMap = {};
  for (let i = 1; i < options.length; ++i) {
    companyCodeMap[options[i].attribs.value] = options[i].children[0]?.data;
  }

  console.log('scrapped kniftech');

  await browser.close();
  return companyCodeMap;
}

async function scrap() {
  try {
    const [cameo, bigshare, linkin, maashitla, kfintech] = await Promise.all([
      ScrapperCameo(),
      ScrapperBigshare(),
      ScrapperLinkintime(),
      ScrapperMaashitla(),
      ScrapperKfintech(),
    ]);

    return {
      cameo: cameo,
      bigshare: bigshare,
      linkin: linkin,
      maashitla: maashitla,
      kfintech: kfintech,
    };
  } catch (err) {
    console.error(err);
  }
}

module.exports = { scrap };
