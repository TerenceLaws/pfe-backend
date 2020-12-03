const express = require("express")
const logger = require("morgan")
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(logger('tiny', { skip: () => process.env.NODE_ENV === "tests" }))

const citizenRoutes = require("../routes/citizenRouter")
const professionalRoutes = require("../routes/professionalRouter")
const facilityLocationRoutes = require("../routes/facilityLocationRouter")
const qrCodeRoutes = require("../routes/qrCodeRouter")
const scannedCodeRoutes = require("../routes/scannedCodeRouter")

app.use(citizenRoutes, professionalRoutes, qrCodeRoutes, scannedCodeRoutes)
app.use("/professionals", facilityLocationRoutes)

app.get("/", function (req, res) {
    return res.send('<p>API for BlockCovid (Group 6)</p>').status(200)
});

app.listen(process.env.PORT || 5000, () => {
    if(process.env.NODE_ENV === "dev") console.log("Server is running!")
});

module.exports = app