const express = require("express")
const router = express.Router()

const facility_controller = require("../controllers/facilityController")

router.get("/facilities", facility_controller.facility_list)
router.post("/facilities/login", facility_controller.facility_login)
router.post("/facilities/register", facility_controller.facility_register)

module.exports = router;