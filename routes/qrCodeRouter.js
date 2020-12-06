const express = require("express")
const router = express.Router()

const qrcode_controller = require("../controllers/qrCodeController")

router.get("/qrcodes", qrcode_controller.qrcode_list)
router.post("/qrcodes/scan", qrcode_controller.qrcode_scan)
router.post("/qrcodes/insert", qrcode_controller.qrcode_insert)
router.get("/qrcodes/:id", qrcode_controller.qrcode_find_by_facility_id)

module.exports = router;