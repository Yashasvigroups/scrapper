// const { SCRAP_URL, KFINTECH_SELECTOR } = require('../static/static');
// const puppeteer = require('puppeteer');
// // const fs = require("node:fs");
// const Tesseract = require('tesseract.js');

// async function checkPanWithKifntech(companyCode, pans) {
//   try {
//     let calls = [];
//     for (let i = 0; i < pans.length; ++i) {
//       if (pans[i].panNumber) {
//         calls.push(getAllotmentsKfintech(companyCode, pans[i].panNumber));
//       }
//     }

//     let results = await Promise.allSettled(calls);

//     // check for alloted, not applied, not alloted
//     const res = {};
//     results.forEach((response, index) => {
//       let panNumber = pans[index].panNumber;
//       res[panNumber] = response.value;
//     });

//     return res;
//   } catch (err) {
//     console.log('while checking allotment', err);
//     throw new Error('Something went wrong while checking allotment');
//   }
// }

// async function getAllotmentsKfintech(cid, panNumber) {
//   const browser = await puppeteer.launch({
//     headless: true,
//     // slowMo: 100,
//     args: ['--no-sandbox', '--disable-setuid-sandbox'],
//   });
//   const page = await browser.newPage();
//   try {
//     // load page
//     await page.goto(SCRAP_URL.KFINTECH, { waitUntil: 'networkidle2' });
//     await page.waitForSelector(KFINTECH_SELECTOR.IPO_SELECT);

//     // imitate selection
//     await page.click(KFINTECH_SELECTOR.IPO_SELECT);
//     await page.select(KFINTECH_SELECTOR.IPO_SELECT, cid);

//     // select pan option
//     await page.click(KFINTECH_SELECTOR.PAN_OPTION);

//     // imitate pan input
//     await page.click(KFINTECH_SELECTOR.PAN_INPUT);
//     await page.type(KFINTECH_SELECTOR.PAN_INPUT, panNumber);

//     // loop till captcha fails
//     let matched = false;
//     while (!matched) {
//       // wait till image
//       let imageElement = await page.waitForSelector(
//         KFINTECH_SELECTOR.CAPTCHA_IMAGE
//       );
//       // get buffer
//       let imageBuffer = await imageElement.screenshot();
//       let captcha = await processCaptcha(imageBuffer);
//       // remove non number chars
//       captcha = captcha
//         .split('')
//         .filter((v) => v && !isNaN(v))
//         .join('');
//       // console.log(captcha);
//       // enter captcha
//       await page.type(KFINTECH_SELECTOR.CAPTCHA_INPUT, ''); // reset
//       await page.type(KFINTECH_SELECTOR.CAPTCHA_INPUT, captcha);
//       // submit form by clicking submit
//       await page.click(KFINTECH_SELECTOR.SUBMIT_BUTTON);

//       // not sure why but till getting response from site
//       await Promise.any([
//         page.waitForSelector(KFINTECH_SELECTOR.OK_BUTTON),
//         page.waitForSelector(KFINTECH_SELECTOR.SUCCESS_ALLOTTMENT),
//       ]);

//       // handeling cases
//       const okButton = await page.$(KFINTECH_SELECTOR.OK_BUTTON);
//       const errorElement = await page.$(KFINTECH_SELECTOR.POPUP_CONTENT);
//       let errorDetails = '';
//       if (errorElement)
//         errorDetails = await page.evaluate(
//           (el) => el.textContent,
//           errorElement
//         );
//       // when error message has pan details then it is not applied
//       if (errorDetails.toLowerCase().includes('pan details')) {
//         matched = true;
//         return -1;
//       } else if (errorDetails.toLowerCase().includes('ipo')) {
//         matched = true;
//         return 'registrar removed the company from ipo';
//       } else if (okButton) {
//         // if ok button found then there is captcha error sorefresh and try again
//         await okButton.click();
//         let refreshCaptcha = await page.$('a.refresh');
//         if (refreshCaptcha) await refreshCaptcha.click();
//         await new Promise((r, j) => setTimeout(r, 800));
//         continue;
//       } else matched = true; // captcha matched

//       let allotmentElement = await page.$(KFINTECH_SELECTOR.SUCCESS_ALLOTTMENT);
//       if (allotmentElement) {
//         let alloted = await page.evaluate(
//           (el) => el.textContent,
//           allotmentElement
//         );
//         if (alloted === '0') {
//           return 0;
//         } else {
//           return alloted;
//         }
//       }
//       throw new Error('something happened in kfinttech');
//     }
//   } catch (err) {
//     console.log(err);
//   } finally {
//     await page.close();
//     await browser.close();
//   }
// }

// async function processCaptcha(imageBuffer) {
//   try {
//     // fs.writeFileSync("./" + Date.now() + ".png", imageBuffer);
//     let data = await Tesseract.recognize(imageBuffer, 'eng', {
//       tessedit_char_whitelist: '0123456789',
//       tessedit_pageseg_mode: 6, // PSM mode optimized for blocks of text
//     }).catch((error) => {
//       console.error(`Error processing ${file}:`, error);
//     });

//     return data.data.text;
//   } catch (err) {
//     console.log(err);
//     throw new Error("couldn't get captcha");
//   }
// }

// module.exports = { checkPanWithKifntech };
