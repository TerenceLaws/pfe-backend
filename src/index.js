const express = require("express")
const logger = require("morgan")
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(logger('tiny', { skip: () => process.env.NODE_ENV === "tests" }))

const citizenRoutes = require("../routes/citizenRouter")
const doctorRoutes = require("../routes/doctorRouter")
const facilityRoutes = require("../routes/facilityRouter")
const facilityLocationRoutes = require("../routes/facilityLocationRouter")
const qrCodeRoutes = require("../routes/qrCodeRouter")
const scannedCodeRoutes = require("../routes/scannedCodeRouter")

app.use(citizenRoutes, doctorRoutes, facilityRoutes, qrCodeRoutes, scannedCodeRoutes)
app.use("/facilities", facilityLocationRoutes)

app.get("/", function (req, res) {
    return res.send('<p>API for BlockCovid (Group 6)</p>').status(200)
});

app.listen(process.env.PORT || 5000, () => {
    if(process.env.NODE_ENV === "dev") console.log("Server is running!")
});

module.exports = app