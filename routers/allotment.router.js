const router = require("express").Router();
const {
  checkAllotments,
  recheckAllotment,
} = require("../handlers/checkAllotments");
const { fileHandler } = require("../middlewares/fileHandler");

router.get(
  "/checkAllotments/:companyId",
  fileHandler.single("file"),
  checkAllotments
);
router.get("/recheckAllotment/:companyId", recheckAllotment);

module.exports = router;
