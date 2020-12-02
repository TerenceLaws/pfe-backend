const express = require("express")
const router = express.Router()

const facility_location_controller = require("../controllers/facilityLocationController")

router.get("/locations", facility_location_controller.facility_location_list)

module.exports = router;