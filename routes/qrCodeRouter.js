const express = require("express")
const router = express.Router()

const qrcode_controller = require("../controllers/qrCodeController")

router.get("/qrcodes", qrcode_controller.qrcode_list)
router.post("/qrcodes", qrcode_controller.qrcode_insert)

module.exports = router;