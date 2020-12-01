const express = require("express")
const router = express.Router()

const doctor_controller = require("../controllers/doctorController")

router.get("/doctors", doctor_controller.doctor_list)
router.post("/doctors", doctor_controller.doctor_login)

module.exports = router;