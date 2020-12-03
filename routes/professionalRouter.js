const express = require("express")
const router = express.Router()

const facility_controller = require("../controllers/professionalController")

router.get("/professionals", facility_controller.professional_list)
router.post("/professionals/login", facility_controller.professional_login)
router.post("/professionals/register", facility_controller.professional_register)

module.exports = router;