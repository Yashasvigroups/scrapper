const { default: puppeteer } = require('puppeteer');

async function chittorgrah(req, res) {
  const { title, id } = req.params;
  const response = {
    logo: '',
    faceValue: '',
    lotSize: '',
    issueSize: '',
    priceBand: '',
    about: '',
    objective: '',
    peRatio: '',
    managers: '',
    promoters: '',
    drhp: '',
    rhp: '',
    anchor: '',
    address: '',
    contact: '',
    email: '',
    website: '',
    allotmentDate: '',
    refundDate: '',
    sharesCreditDate: '',
    listingDate: '',
    report: [],
    amountIn: '',
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

    await Promise.allSettled([page.click('#splashBackURL')]);

    const [
      logo,
      firstTable,
      links,
      issueSize,
      about,
      objective,
      pERatio,
      address,
      leadManagers,
      report,
      dates,
      promoters,
    ] = await Promise.allSettled([
      page.evaluate(getLogo),
      page.evaluate(getFirstTableDetails),
      page.evaluate(getLinks),
      page.evaluate(getIssueSize),
      page.evaluate(getAbout),
      page.evaluate(getObjective),
      page.evaluate(getPERatio),
      page.evaluate(getAddress),
      page.evaluate(getLeadManagers),
      page.evaluate(getReport),
      page.evaluate(getDates),
      page.evaluate(getPromoters),
    ]);
    if (logo.status == 'fulfilled') {
      response.logo = logo.value;
    } else {
      console.log('failed ', 'logo');
    }
    if (issueSize.status == 'fulfilled') {
      response.issueSize = issueSize.value;
    } else {
      console.log('failed ', 'issueSize');
    }
    if (firstTable.status == 'fulfilled') {
      response.faceValue = firstTable.value.faceValue;
      response.lotSize = firstTable.value.lotSize;
      response.priceBand = firstTable.value.priceBand;
    } else {
      console.log('failed ', 'firstTable');
    }
    if (about.status == 'fulfilled') {
      response.about = about.value;
    } else {
      console.log('failed ', 'about');
    }
    if (objective.status == 'fulfilled') {
      response.objective = objective.value;
    } else {
      console.log('failed ', 'objective');
    }
    if (pERatio.status == 'fulfilled') {
      response.peRatio = pERatio.value;
    } else {
      console.log('failed ', 'pERatio');
    }
    if (leadManagers.status == 'fulfilled') {
      response.managers = leadManagers.value;
    } else {
      console.log('failed ', 'leadManagers');
    }
    if (promoters.status == 'fulfilled') {
      response.promoters = promoters.value;
    } else {
      console.log('failed ', 'promoters');
    }
    if (links.status == 'fulfilled') {
      response.drhp = links.value.drhp;
      response.rhp = links.value.rhp;
      response.anchor = links.value.anchor;
    } else {
      console.log('failed ', 'links');
    }
    if (address.status == 'fulfilled') {
      response.address = address.value.address;
      response.contact = address.value.phone;
      response.email = address.value.email;
      response.website = address.value.website;
    } else {
      console.log('failed ', 'address');
    }
    if (dates.status == 'fulfilled') {
      response.allotmentDate = dates.value.allotmentDate;
      response.refundDate = dates.value.refundDate;
      response.sharesCreditDate = dates.value.sharesCreditDate;
      response.listingDate = dates.value.listingDate;
    } else {
      console.log('failed ', 'dates');
    }
    if (report.status == 'fulfilled') {
      response.report = report.value.arr;
      response.amountIn = report.value.amountIn;
    } else {
      console.log('failed ', 'report');
    }
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json('internal server error');
  } finally {
    await browser.close();
  }
}

async function subscription(req, res) {
  const { title, id } = req.params;
  const response = {
    qib: '0',
    nibat: '0',
    nibbt: '0',
    retail: '0',
    employee: '0',
    shareHolders: '0',
  };
  let subscriptionUrl =
    'https://www.chittorgarh.com/ipo_subscription/' + title + '/' + id;
  const browser = await puppeteer.launch({
    headers: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const subscriptionPage = await browser.newPage();

  try {
    // SUBSCRIPTION
    await subscriptionPage.goto(subscriptionUrl);
    const [resp] = await Promise.allSettled([
      subscriptionPage.waitForSelector(
        "[itemtype='https://schema.org/Table']",
        { timeout: 20000 }
      ),
    ]);
    if (resp.status == 'fulfilled') {
      const offered = await subscriptionPage.evaluate(getOffered);
      response.qib = offered.qib || '0';
      if (!offered.nibat || !offered.nibbt) {
        response.nibat = offered.nii || '0';
        response.nibbt = offered.nii || '0';
      } else {
        response.nibat = offered.nibat;
        response.nibbt = offered.nibbt;
      }
      response.retail = offered.retail || '0';
      response.employee = offered.employee || '0';
      response.shareHolders = offered.shareHolders || '0';
    }
    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json('internal server error');
  } finally {
    await browser.close();
  }
}

function getLogo() {
  const images = document.querySelectorAll('img.img-fluid');
  if (images) {
    const withTitle = Array.from(images).filter((v) => v.getAttribute('title'));
    if (withTitle?.length > 0) {
      return withTitle[0].src;
    }
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

function getFirstTableDetails() {
  const obj = {
    faceValue: 0,
    priceBand: '',
    lotSize: 0,
  };
  document
    .querySelectorAll("[itemtype='http://schema.org/Table']")
    .forEach((v) => {
      if (
        v.querySelector('h2')?.innerText?.toLowerCase()?.includes('ipo details')
      ) {
        v.querySelectorAll('tr')?.forEach((v) => {
          // lotsize
          if (
            v?.innerText?.toLowerCase()?.includes('lot size') &&
            v?.children?.length > 0
          ) {
            let s = v?.children[1]?.innerText.replaceAll(',', '');
            if (s) {
              obj.lotSize = parseInt(s);
            }
          }
          // face value
          if (
            v?.innerText?.toLowerCase()?.includes('face value') &&
            v?.children?.length > 0
          ) {
            let s = v?.children[1]?.innerText?.replaceAll('₹', '');
            if (s) {
              obj.faceValue = parseInt(s);
            }
          }
          // price band
          if (
            v?.innerText?.toLowerCase()?.includes('price band') &&
            v?.children?.length > 0
          ) {
            range = v?.children[1]?.innerText?.split(' per share');
            if (range?.length > 0) {
              obj.priceBand = range[0];
            }
          }
        });
      }
    });

  return obj;
}
function getIssueSize() {
  const ele = document.querySelectorAll('table');
  let sz = '';
  if (ele.length >= 1) {
    ele[1]?.querySelector('tbody')?.childNodes?.forEach((v) => {
      if (v?.innerText?.toLowerCase()?.includes('issue size')) {
        let s = v?.innerText.split('₹');
        if (s && s.length > 0) {
          sz = s[1]?.slice(0, -1);
        }
      }
    });
  }
  return sz;
}

function getAbout() {
  const elements = document.querySelector('#ipoSummary');
  return (
    Array.from(elements?.children || [])
      ?.map((v) => v?.innerText)
      ?.join(' \n\n') || ''
  );
}

function getObjective() {
  const element = document.querySelector('#ObjectiveIssue > tbody');
  return (
    Array.from(element?.childNodes || [])
      ?.map((v) => v?.childNodes[3]?.innerText)
      ?.join(' \n\n') || ''
  );
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
  if (element?.length >= 1) {
    const ol = element[1]?.querySelector('ol');
    return Array.from(ol?.childNodes || [])
      ?.map((v) => v?.querySelector('a')?.innerText)
      .join(', ');
  }
  return '';
}

function getOffered() {
  const offered = {};
  const element = document.querySelector(
    "[itemtype='https://schema.org/Table'] tbody"
  );
  element?.querySelectorAll('tr')?.forEach((v) => {
    let label = v?.innerText?.toLowerCase() || '';
    if (
      (label?.includes('qib') || label?.includes('qualified')) &&
      v?.children?.length > 2
    ) {
      offered.qib = v?.children[2]?.innerText?.replaceAll(',', '');
    }
    if (label?.includes('bnii') && v?.children?.length > 2) {
      offered.nibat = v?.children[2]?.innerText?.replaceAll(',', '');
    }
    if (label?.includes('snii') && v?.children?.length > 2) {
      offered.nibbt = v?.children[2]?.innerText?.replaceAll(',', '');
    }
    if (label?.includes('buyers') && v?.children?.length > 2) {
      offered.nii = v?.children[2]?.innerText?.replaceAll(',', '');
    }
    if (
      (label?.includes('retail') || label?.includes('individual')) &&
      v?.children?.length > 2
    ) {
      offered.retail = v?.children[2]?.innerText?.replaceAll(',', '');
    }
    if (label?.includes('employee') && v?.children?.length > 2) {
      offered.employee = v?.children[2]?.innerText?.replaceAll(',', '');
    }
    if (label?.includes('holders') && v?.children?.length > 2) {
      offered.shareHolders = v?.children[2]?.innerText?.replaceAll(',', '');
    }
  });
  return offered;
}

function getReport() {
  const element = document.querySelector('#financialTable > tbody');
  const rows = Array.from(element?.childNodes || []);
  rows?.splice(4);
  const arr = [];
  rows?.forEach((v, i) => {
    v?.childNodes?.forEach((d, j) => {
      if (j == 0) return;

      if (i == 0) {
        arr.push({ year: d?.innerText.split(' ')[2] });
      } else if (i == 1) {
        arr[j - 1].asset = d?.innerText.replaceAll(',', '');
      } else if (i == 2) {
        arr[j - 1].revenue = d?.innerText.replaceAll(',', '');
      } else {
        arr[j - 1].pat = d?.innerText.replaceAll(',', '');
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
      element?.childNodes?.forEach((v) => {
        if (v?.childNodes?.length == 0) {
          return;
        }
        const label = v?.childNodes[0]?.innerText?.toLowerCase();
        if (label?.includes('allotment')) {
          dates.allotmentDate = new Date(
            v?.childNodes[1]?.innerText
          ).toLocaleDateString();
        }
        if (label?.includes('credit')) {
          dates.sharesCreditDate = new Date(
            v?.childNodes[1]?.innerText
          ).toLocaleDateString();
        }
        if (label?.includes('refund')) {
          dates.refundDate = new Date(
            v?.childNodes[1]?.innerText
          ).toLocaleDateString();
        }
        if (label?.includes('listing')) {
          dates.listingDate = new Date(
            v?.childNodes[1]?.innerText
          ).toLocaleDateString();
        }
      });
    }
  });
  return dates;
}

function getPromoters() {
  let promoters = '';
  document.querySelectorAll('h2')?.forEach((v) => {
    if (v?.innerText?.includes('Holding')) {
      promoters = v?.nextElementSibling.innerText;
    }
  });
  return promoters;
}

module.exports = { chittorgrah, subscription };
