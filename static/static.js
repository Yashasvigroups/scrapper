const KFINTECH = 'https://kosmic.kfintech.com/ipostatus/';

const KFINTECH_SELECTOR = {
  IPO_SELECT: 'select#ddl_ipo',
  PAN_OPTION: 'input#pan',
  PAN_INPUT: 'input#txt_pan',
  CAPTCHA_IMAGE: 'img#captchaimg',
  CAPTCHA_INPUT: 'input#txt_captcha',
  SUBMIT_BUTTON: 'a#btn_submit_query',
  SUCCESS_ALLOTTMENT: 'span#grid_results_ctl02_lbl_allot',
  OK_BUTTON: '.jconfirm-buttons',
  POPUP_CONTENT: '.jconfirm-content',
};

const REGISTRAR = {
  CAMEO: 'CAMEO',
  MAASHITLA: 'MAASHITLA',
  BIGSHARE: 'BIGSHARE',
  LINKINTIME: 'LINKINTIME',
  KFINTECH: 'KFINTECH',
  SKYLINE: 'SKYLINE',
  PURVA: 'PURVA',
};

const SCRAP_URL = {
  CAMEO: 'https://ipostatus3.cameoindia.com/',
  MAASHITLA: 'https://maashitla.com/allotment-status/public-issues',
  BIGSHARE: 'https://ipo.bigshareonline.com/IPO_Status.html',
  // LINKINTIME: 'https://in.mpms.mufg.com/Initial_Offer/IPO.aspx/GetDetails',
  LINKINTIME: 'https://in.mpms.mufg.com/Initial_Offer/public-issues.html',
  KFINTECH: 'https://ipostatus.kfintech.com/',
  SKYLINE: 'https://www.skylinerta.com/ipo.php',
  PURVA: '',
};

module.exports = {
  KFINTECH_SELECTOR,
  KFINTECH,
  REGISTRAR,
  SCRAP_URL,
};
