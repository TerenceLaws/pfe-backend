const express = require("express")
const router = express.Router()

const doctor_controller = require("../controllers/doctorController")

router.get("/doctors", doctor_controller.doctor_list)

module.exports = router;