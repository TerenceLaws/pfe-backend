const express = require("express")
const router = express.Router()

const facility_controller = require("../controllers/facilityController")

router.get("/facilities", facility_controller.facility_list)
router.post("/facilities", facility_controller.facility_login)

module.exports = router;