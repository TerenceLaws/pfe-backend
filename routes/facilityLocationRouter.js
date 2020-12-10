const express = require("express")
const router = express.Router()
const auth = require('../middleware/auth')

const facility_location_controller = require("../controllers/locationController")

router.get("/locations", facility_location_controller.location_list)
router.get("/locations_by_facility", facility_location_controller.location_list_by_facility_id)
router.post("/locations", facility_location_controller.location_create)

module.exports = router;