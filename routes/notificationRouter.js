const express = require("express")
const router = express.Router()

const notification_controller = require("../controllers/notificationController")

router.get("/notification/publickey", notification_controller.send_public_key)
router.post("/notification/subscribe", notification_controller.subscribe)

module.exports = router;