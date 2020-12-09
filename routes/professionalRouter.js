const express = require("express")
const router = express.Router()
const auth = require('../middleware/auth')

const professional_controller = require("../controllers/professionalController")

router.get("/professionals", professional_controller.professional_list)
router.post("/professionals/login", professional_controller.professional_login)
router.post("/professionals/register", professional_controller.professional_register)

module.exports = router;