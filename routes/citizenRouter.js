const express = require("express")
const router = express.Router()

const citizen_controller = require("../controllers/citizenController")

router.get("/citizens", citizen_controller.list_citizens)
router.post("/citizens", citizen_controller.create_citizen)

module.exports = router;