const { default: puppeteer } = require('puppeteer');

async function scrapChittor(req, res) {
  const { url } = req.body;
  const response = {
    lotSize: '',
    issueSize: '',
    faceValue: '',
    priceBand: '',
    peRatio: '',
    qib: '',
    nibat: '',
    nibbt: '',
    retail: '',
    address: '',
    email: '',
    contact: '',
    website: '',
    about: '',
    objective: '',
    managers: '',
    promoters: '',
    logo: '',
    drhp: '',
    rhp: '',
    anchor: '',
    report: [],
  };
  const browser = await puppeteer.launch({
    headers: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  try {
    await page.goto(url);
    await page.waitForSelector('img.img-fluid');

    response.logo = await page.evaluate(getLogo);
    response.faceValue = await page.evaluate(getFaceValue);
    response.lotSize = await page.evaluate(getLotSize);
    const obj = await page.evaluate(getLinks);
    response.drhp = obj.drhp;
    response.rhp = obj.rhp;
    response.anchor = obj.anchor;
    response.issueSize = await page.evaluate(getIssueSize);
    response.priceBand = await page.evaluate(getPriceBand);
    response.about = await page.evaluate(getAbout);
    response.objective = await page.evaluate(getObjective);
    response.peRatio = await page.evaluate(getPERatio);
    const address = await page.evaluate(getAddress);
    response.address = address.address;
    response.contact = address.phone;
    response.email = address.email;
    response.website = address.website;
    response.managers = await page.evaluate(getLeadManagers);
    const offered = await page.evaluate(getOffered);
    response.qib = offered.qib;
    response.nibat = offered.nibat;
    response.nibbt = offered.nibbt;
    response.retail = offered.retail;
    response.report = await page.evaluate(getReport);

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json('internal server error');
  } finally {
    await browser.close();
  }
  return;
}

function getLogo() {
  const images = document.querySelectorAll('img.img-fluid');
  const withTitle = Array.from(images).filter((v) => v.getAttribute('title'));
  if (withTitle.length > 0) {
    return withTitle[0].src;
  }
  console.log('logo', withTitle);
  return '';
}

function getLinks() {
  const obj = {
    rhp: '',
    drhp: '',
    anchor: '',
  };
  const opts = document.querySelector('ul.dropdown-menu');
  opts.childNodes.forEach((v) => {
    const link = v?.querySelector('a')?.href;
    if (v?.innerText?.toLowerCase().includes('drhp')) {
      obj.drhp = link;
    } else if (v?.innerText?.toLowerCase().includes('rhp')) {
      obj.rhp = link;
    } else if (v?.innerText?.toLowerCase().includes('anchor')) {
      obj.anchor = link;
    } else {
      console.log('links', link);
    }
  });
  return obj;
}

function getLotSize() {
  const element = document.querySelector(
    '#main > div:nth-child(6) > div:nth-child(1) > div:nth-child(1) > table > tbody > tr:nth-child(5) > td:nth-child(2)'
  )?.innerText;
  if (element?.toLowerCase()?.includes(' shares')) {
    return element?.split(' Shares')[0];
  }
  console.log('lot', element);
  return 0;
}

function getFaceValue() {
  const element = document.querySelector(
    '#main > div:nth-child(6) > div:nth-child(1) > div:nth-child(1) > table > tbody > tr:nth-child(3) > td:nth-child(2)'
  )?.innerText;
  if (element?.includes(' per share')) {
    return element?.split(' per share')[0].split('₹')[1];
  }
  console.log('face', element);
  return 0;
}

function getIssueSize() {
  const element = document.querySelector(
    '#main > div:nth-child(6) > div:nth-child(1) > div:nth-child(1) > table > tbody > tr:nth-child(7) > td:nth-child(2)'
  )?.innerText;
  if (element?.includes(' shares')) {
    return element?.split(' shares')[0]?.replaceAll(',', '');
  }
  console.log('issueSize', element);
  return 0;
}

function getPriceBand() {
  const element = document.querySelector(
    '#main > div:nth-child(6) > div:nth-child(1) > div:nth-child(1) > table > tbody > tr:nth-child(4) > td:nth-child(2)'
  )?.innerText;
  if (element?.includes(' per share')) {
    return element?.split(' per share')[0];
  }
  console.log('priceBand', element);
  return '';
}

function getAbout() {
  const elements = document.querySelector('#ipoSummary');
  return Array.from(elements.children)
    .map((v) => v.innerText)
    .join(' \n\n');
}

function getObjective() {
  const element = document.querySelector('#ObjectiveIssue > tbody');
  return Array.from(element?.childNodes)
    .map((v) => v.childNodes[3].innerText)
    .join(' \n\n');
}

function getPERatio() {
  const element = document.querySelector(
    `[data-bs-title="P/E Ratio Information"]`
  )?.parentElement?.parentElement;
  if (element && element?.childNodes?.length >= 3) {
    return element?.childNodes[2]?.innerText;
  }
  console.log('peRatio', element);
  return 0;
}

function getAddress() {
  const obj = {
    address: '',
    phone: '',
    email: '',
    website: '',
  };
  let text = document
    .querySelector('address > p')
    ?.innerText?.split('\nPhone: ');
  obj.address = text[0];
  text = text[1].split('\nEmail: ');
  obj.phone = text[0];
  text = text[1].split('\nWebsite: ');
  obj.email = text[0];
  obj.website = text[1];
  return obj;
}

function getLeadManagers() {
  const element =
    document.querySelector('#recommendation')?.parentElement?.childNodes;
  if (element.length >= 1) {
    const ol = element[1]?.querySelector('ol');
    return Array.from(ol?.childNodes)
      ?.map((v) => v?.querySelector('a')?.innerText)
      .join(', ');
  }
  console.log('lead', element);
  return '';
}

function getOffered() {
  function rp(str) {
    return str.split(' ')[0].replaceAll(',', '');
  }
  const obj = {
    qib: 0,
    nibat: 0,
    nibbt: 0,
    retail: 0,
  };
  const element = document.querySelector(
    '#main > div:nth-child(6) > div:nth-child(1) > div:nth-child(2) > div > div > table'
  );
  element?.childNodes?.forEach((v) => {
    if (
      v.nodeName == 'TBODY' &&
      v.className.includes('collaps') &&
      v.id == 'nii-details-toggle'
    ) {
      // handle tr niibt, niiat
      v?.childNodes?.forEach((tr) => {
        if (tr?.childNodes[0]?.innerText?.toLowerCase().includes('bnii')) {
          obj.nibat = rp(tr?.childNodes[1]?.innerText);
        } else if (
          tr?.childNodes[0]?.innerText?.toLowerCase().includes('snii')
        ) {
          obj.nibbt = rp(tr?.childNodes[1]?.innerText);
        }
      });
    } else if (v.nodeName == 'TBODY' && v.className.includes('collaps')) {
      // skip QIB collapsable
    } else if (v.nodeName == 'TBODY') {
      // handle retail, employee and other
      v?.childNodes?.forEach((tr) => {
        if (tr?.childNodes[0]?.innerText?.toLowerCase().includes('retail')) {
          obj.retail = rp(tr?.childNodes[1]?.innerText);
        } else if (
          tr?.childNodes[0]?.innerText?.toLowerCase().includes('qib')
        ) {
          obj.qib = rp(tr?.childNodes[1]?.innerText);
        } else if (
          tr?.childNodes[0]?.innerText?.toLowerCase().includes('bnii')
        ) {
          obj.nibat = rp(tr?.childNodes[1]?.innerText);
        } else if (
          tr?.childNodes[0]?.innerText?.toLowerCase().includes('snii')
        ) {
          obj.nibbt = rp(tr?.childNodes[1]?.innerText);
        }
      });
    }
  });
  return obj;
}

function getReport() {
  const element = document.querySelector('#financialTable > tbody');
  const rows = Array.from(element?.childNodes);
  rows.splice(4);
  const arr = [];
  rows?.forEach((v, i) => {
    v?.childNodes?.forEach((d, j) => {
      if (j == 0) return;

      if (i == 0) {
        arr.push({ year: d.innerText.split(' ')[2] });
      } else if (i == 1) {
        arr[j - 1].asset = d.innerText.replaceAll(',', '');
      } else if (i == 2) {
        arr[j - 1].revenue = d.innerText.replaceAll(',', '');
      } else {
        arr[j - 1].pat = d.innerText.replaceAll(',', '');
      }
    });
  });

  return arr;
}

module.exports = { scrapChittor };
