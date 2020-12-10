const express = require("express")
const logger = require("morgan")
require('dotenv').config()

const bodyParser = require('body-parser')
const cors = require('cors')




const app = express()
app.use(express.json())
app.use(logger('tiny', { skip: () => process.env.NODE_ENV === "tests" }))

app.use(cors())
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');

    // authorized headers for preflight requests
    // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,authorization');

    next();


    app.options('*', (req, res) => {
        // allowed XHR methods
        res.header('Access-Control-Allow-Methods', 'GET, PATCH, PUT, POST, DELETE, OPTIONS');
        res.send();
    });
});

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