const express = require("express")
const logger = require("morgan")
require('dotenv').config()

const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(logger('tiny', { skip: () => process.env.NODE_ENV === "tests" }))
app.use(express.static('public'));

app.use(cors())
app.options('*', cors());

app.use(bodyParser.json())

const citizenRoutes = require("../routes/citizenRouter")
const professionalRoutes = require("../routes/professionalRouter")
const facilityLocationRoutes = require("../routes/facilityLocationRouter")
const qrCodeRoutes = require("../routes/qrCodeRouter")
const scannedCodeRoutes = require("../routes/scannedCodeRouter")
const notificationRoutes = require("../routes/notificationRouter")

app.use(citizenRoutes, professionalRoutes, qrCodeRoutes, scannedCodeRoutes, notificationRoutes)
app.use("/professionals", facilityLocationRoutes)

app.get("/", function (req, res) {
    return res.send('<p>API for BlockCovid (Group 6)</p>').status(200)
});

app.listen(process.env.PORT || 5000, () => {
    if(process.env.NODE_ENV === "dev") console.log("Server is running!")
});

module.exports = app