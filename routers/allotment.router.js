const router = require("express").Router();
const {
  checkAllotments,
  recheckAllotment,
} = require("../handlers/checkAllotments");
const { fileHandler } = require("../middlewares/fileHandler");

router.post(
  "/checkAllotments/:companyId",
  fileHandler.single("file"),
  checkAllotments
);
router.post("/recheckAllotment/:companyId", recheckAllotment);

module.exports = router;
