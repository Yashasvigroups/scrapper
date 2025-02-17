const REGISTRAR = {
  CAMEO: 'CAMEO',
  MAASHITLA: 'MAASHITLA',
  BIGSHARE: 'BIGSHARE',
  LINKINTIME: 'LINKINTIME',
};

const SCRAP_URL = {
  CAMEO: 'https://ipostatus3.cameoindia.com:3000/api/1.0/ipostatus',
  MAASHITLA: 'https://maashitla.com/PublicIssues/Search',
  BIGSHARE: 'https://ipo.bigshareonline.com/Data.aspx/FetchIpodetails',
  LINKINTIME: 'https://in.mpms.mufg.com/Initial_Offer/IPO.aspx/SearchOnPan',
};

const STATUS = {
  NOT_APPLIED: 'NOT APPLIED',
  NOT_ALLOTED: 'NOT ALLOTED',
  ALLOTED: ' ALLOTED SHARES',
};

module.exports = {
  STATUS,
  REGISTRAR,
  SCRAP_URL,
};
