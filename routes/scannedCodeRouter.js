const express = require("express")
const router = express.Router()

const scanned_code_controller = require("../controllers/scannedCodeController")

router.get("/scannedcodes", scanned_code_controller.scanned_code_list)

module.exports = router;