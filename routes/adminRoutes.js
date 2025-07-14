const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const adminController = require("../controllers/adminController");

router.use(auth.requireAdmin);

router.get("/", adminController.dashboard);
router.get("/accounts", adminController.accountList);

module.exports = router;
