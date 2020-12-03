const express = require("express")
const router = express.Router()

const facility_location_controller = require("../controllers/facilityLocationController")

router.get("/locations", facility_location_controller.facility_location_list)
router.post("/locations", facility_location_controller.pro_loc_add)

module.exports = router;