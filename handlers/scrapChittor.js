const { default: puppeteer } = require('puppeteer');

async function scrapChittor(req, res) {
  const { title, id } = req.params;
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
    amountIn: '',
    allotmentDate: new Date().toLocaleDateString(),
    shareCreditDate: new Date().toLocaleDateString(),
    refundDate: new Date().toLocaleDateString(),
    listingDate: new Date().toLocaleDateString(),
    logo: '',
    drhp: '',
    rhp: '',
    anchor: '',
    report: [],
  };
  let url = 'https://www.chittorgarh.com/ipo/' + title + '/' + id;
  const browser = await puppeteer.launch({
    headers: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  try {
    await page.goto(url);
    await page.waitForSelector('img.img-fluid');
    const [
      logo,
      faceValue,
      lotSize,
      links,
      issueSize,
      priceBand,
      about,
      objective,
      pERatio,
      address,
      leadManagers,
      offered,
      report,
      dates,
      promoters,
    ] = await Promise.all([
      page.evaluate(getLogo),
      page.evaluate(getFaceValue),
      page.evaluate(getLotSize),
      page.evaluate(getLinks),
      page.evaluate(getIssueSize),
      page.evaluate(getPriceBand),
      page.evaluate(getAbout),
      page.evaluate(getObjective),
      page.evaluate(getPERatio),
      page.evaluate(getAddress),
      page.evaluate(getLeadManagers),
      page.evaluate(getOffered),
      page.evaluate(getReport),
      page.evaluate(getDates),
      page.evaluate(getPromoters),
    ]);
    response.logo = logo;
    response.faceValue = faceValue;
    response.lotSize = lotSize;
    response.drhp = links.drhp;
    response.rhp = links.rhp;
    response.anchor = links.anchor;
    response.issueSize = issueSize;
    response.priceBand = priceBand;
    response.about = about;
    response.objective = objective;
    response.peRatio = pERatio;
    response.address = address.address;
    response.contact = address.phone;
    response.email = address.email;
    response.website = address.website;
    response.managers = leadManagers;
    response.qib = offered.qib;
    response.nibat = offered.nibat;
    response.nibbt = offered.nibbt;
    response.retail = offered.retail;
    response.report = report.arr;
    response.amountIn = report.amountIn;
    response.allotmentDate = dates.allotmentDate;
    response.refundDate = dates.refundDate;
    response.sharesCreditDate = dates.sharesCreditDate;
    response.listingDate = dates.listingDate;
    response.promoters = promoters;

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
  if (withTitle?.length > 0) {
    return withTitle[0].src;
  }
  return '';
}

function getLinks() {
  const obj = {
    rhp: '',
    drhp: '',
    anchor: '',
  };
  const opts = document.querySelector('ul.dropdown-menu');
  opts?.childNodes?.forEach((v) => {
    const link = v?.querySelector('a')?.href;
    if (v?.innerText?.toLowerCase()?.includes('drhp')) {
      obj.drhp = link;
    } else if (v?.innerText?.toLowerCase()?.includes('rhp')) {
      obj.rhp = link;
    } else if (v?.innerText?.toLowerCase()?.includes('anchor')) {
      obj.anchor = link;
    } else {
    }
  });
  return obj;
}

function getLotSize() {
  const ele = document.querySelectorAll('table');
  if (ele.length >= 1) {
    const element = ele[1].querySelector(
      'tr:nth-child(5) > td:nth-child(2)'
    )?.innerText;
    if (element?.toLowerCase()?.includes(' shares')) {
      return element?.split(' Shares')[0];
    }
  }
  return 0;
}

function getFaceValue() {
  const ele = document.querySelectorAll('table');
  if (ele.length >= 1) {
    const element = ele[1].querySelector(
      'tr:nth-child(3) > td:nth-child(2)'
    )?.innerText;
    if (element?.toLowerCase()?.includes(' per share')) {
      return element?.split(' per share')[0]?.split('₹')[1];
    }
  }
  return 0;
}

function getIssueSize() {
  const ele = document.querySelectorAll('table');
  if (ele.length >= 1) {
    const element = ele[1].querySelector(
      'tr:nth-child(7) > td:nth-child(2)'
    )?.innerText;
    if (element?.toLowerCase()?.includes(' shares')) {
      return element?.split(' shares')[0]?.replaceAll(',', '');
    }
  }
  return 0;
}

function getPriceBand() {
  const ele = document.querySelectorAll('table');
  if (ele.length >= 1) {
    const element = ele[1].querySelector(
      'tr:nth-child(4) > td:nth-child(2)'
    )?.innerText;
    if (element?.toLowerCase()?.includes(' per share')) {
      return element?.split(' per share')[0];
    }
  }
  return 0;
}

function getAbout() {
  const elements = document.querySelector('#ipoSummary');
  return Array.from(elements?.children || [])
    ?.map((v) => v?.innerText)
    ?.join(' \n\n');
}

function getObjective() {
  const element = document.querySelector('#ObjectiveIssue > tbody');
  return Array.from(element?.childNodes || [])
    ?.map((v) => v.childNodes[3].innerText)
    ?.join(' \n\n');
}

function getPERatio() {
  const element = document.querySelector(
    `[data-bs-title="P/E Ratio Information"]`
  )?.parentElement?.parentElement;
  if (element && element?.childNodes?.length >= 3) {
    return element?.childNodes[2]?.innerText;
  }
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
  if (text?.length) obj.address = text[0];
  if (text?.length) text = text[1].split('\nEmail: ');
  if (text?.length) obj.phone = text[0];
  if (text?.length) text = text[1].split('\nWebsite: ');
  if (text?.length) obj.email = text[0];
  if (text?.length) obj.website = text[1];
  return obj;
}

function getLeadManagers() {
  const element =
    document.querySelector('#recommendation')?.parentElement?.childNodes;
  if (element.length >= 1) {
    const ol = element[1]?.querySelector('ol');
    return Array.from(ol?.childNodes || [])
      ?.map((v) => v?.querySelector('a')?.innerText)
      .join(', ');
  }
  return '';
}

function getOffered() {
  function rp(str) {
    return str?.split(' ')[0]?.replaceAll(',', '');
  }
  const obj = {
    qib: 0,
    nibat: 0,
    nibbt: 0,
    retail: 0,
  };
  const ele = document.querySelectorAll('table');
  if (ele.length < 3) {
    return obj;
  }
  const element = ele[2];
  element?.childNodes?.forEach((v) => {
    if (
      v.nodeName == 'TBODY' &&
      v.className.includes('collaps') &&
      v.id == 'nii-details-toggle'
    ) {
      // handle tr niibt, niiat
      v?.childNodes?.forEach((tr) => {
        if (tr?.childNodes[0]?.innerText?.toLowerCase()?.includes('bnii')) {
          obj.nibat = rp(tr?.childNodes[1]?.innerText);
        } else if (
          tr?.childNodes[0]?.innerText?.toLowerCase()?.includes('snii')
        ) {
          obj.nibbt = rp(tr?.childNodes[1]?.innerText);
        }
      });
    } else if (v.nodeName == 'TBODY' && v.className?.includes('collaps')) {
      // skip QIB collapsable
    } else if (v.nodeName == 'TBODY') {
      // handle retail, employee and other
      v?.childNodes?.forEach((tr) => {
        if (tr?.childNodes[0]?.innerText?.toLowerCase()?.includes('retail')) {
          obj.retail = rp(tr?.childNodes[1]?.innerText);
        } else if (
          tr?.childNodes[0]?.innerText?.toLowerCase()?.includes('qib')
        ) {
          obj.qib = rp(tr?.childNodes[1]?.innerText);
        } else if (
          tr?.childNodes[0]?.innerText?.toLowerCase()?.includes('bnii')
        ) {
          obj.nibat = rp(tr?.childNodes[1]?.innerText);
        } else if (
          tr?.childNodes[0]?.innerText?.toLowerCase()?.includes('snii')
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
  const rows = Array.from(element?.childNodes || []);
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

  return { arr, amountIn: element?.nextElementSibling?.innerText };
}

function getDates() {
  const dates = {
    allotmentDate: new Date().toLocaleDateString(),
    sharesCreditDate: new Date().toLocaleDateString(),
    refundDate: new Date().toLocaleDateString(),
    listingDate: new Date().toLocaleDateString(),
  };
  const ele = document.querySelectorAll('table');
  ele.forEach((element) => {
    if (element.innerText?.includes('Tentative Allotment')) {
      element = element.querySelector('tbody');
      element.childNodes.forEach((v) => {
        if (v.childNodes.length == 0) {
          return;
        }
        const label = v.childNodes[0]?.innerText?.toLowerCase();
        if (label?.includes('allotment')) {
          dates.allotmentDate = new Date(
            v.childNodes[1]?.innerText
          ).toLocaleDateString();
        }
        if (label?.includes('credit')) {
          dates.sharesCreditDate = new Date(
            v.childNodes[1]?.innerText
          ).toLocaleDateString();
        }
        if (label?.includes('refund')) {
          dates.refundDate = new Date(
            v.childNodes[1]?.innerText
          ).toLocaleDateString();
        }
        if (label?.includes('listing')) {
          dates.listingDate = new Date(
            v.childNodes[1]?.innerText
          ).toLocaleDateString();
        }
      });
    }
  });
  return dates;
}

function getPromoters() {
  let promoters = '';
  document.querySelectorAll('h2').forEach((v) => {
    if (v.innerText?.includes('Holding')) {
      promoters = v.nextElementSibling.innerText;
    }
  });
  return promoters;
}

module.exports = { scrapChittor };
