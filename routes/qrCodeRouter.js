const express = require("express")
const router = express.Router()

const qrcode_controller = require("../controllers/qrCodeController")

router.get("/qrcodes", qrcode_controller.qrcode_list)

module.exports = router;