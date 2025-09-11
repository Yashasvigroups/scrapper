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

module.exports = {
  KFINTECH_SELECTOR,
  KFINTECH,
};
