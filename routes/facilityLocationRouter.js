const express = require("express")
const router = express.Router()
const auth = require('../middleware/auth')

const facility_location_controller = require("../controllers/locationController")

router.get("/locations",auth, facility_location_controller.location_list)
router.post("/locations", facility_location_controller.location_create)

module.exports = router;