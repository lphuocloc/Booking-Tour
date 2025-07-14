const express = require("express");
const router = express.Router();
const auth = require("../middleware/adminAuth");
const adminController = require("../controllers/adminController");

router.use(auth);

router.get("/", adminController.dashboard);
router.get("/accounts", adminController.accountList);

module.exports = router;
