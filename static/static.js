const REGISTRAR = {
  CAMEO: 'CAMEO',
  MAASHITLA: 'MAASHITLA',
  BIGSHARE: 'BIGSHARE',
  LINKINTIME: 'LINKINTIME',
  KFINTECH: 'KFINTECH',
};

const SCRAP_URL = {
  CAMEO: 'https://ipostatus3.cameoindia.com:3000/api/1.0/ipostatus',
  MAASHITLA: 'https://maashitla.com/PublicIssues/Search',
  BIGSHARE: 'https://ipo.bigshareonline.com/Data.aspx/FetchIpodetails',
  LINKINTIME: 'https://in.mpms.mufg.com/Initial_Offer/IPO.aspx/SearchOnPan',
  KFINTECH: 'https://kosmic.kfintech.com/ipostatus/',
};

const STATUS = {
  NOT_APPLIED: 'NOT APPLIED',
  NOT_ALLOTED: 'NOT ALLOTED',
  ALLOTED: ' ALLOTED SHARES',
};

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

module.exports = {
  STATUS,
  REGISTRAR,
  SCRAP_URL,
  KFINTECH_SELECTOR,
};
