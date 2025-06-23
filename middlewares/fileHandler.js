// multer middleware to hadnle file uploads
const multer = require('multer');
const path = require('path');

// file will be csv only and we dont save the file but read its content and parse it with csv-parser
const storage = multer.memoryStorage();
const fileHandler = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname) !== '.csv') {
      return cb(null, false);
    }
    cb(null, true);
  },
});

module.exports = { fileHandler };
