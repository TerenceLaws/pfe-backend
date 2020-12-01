const express = require("express")
const logger = require("morgan")
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(logger('tiny', { skip: () => process.env.NODE_ENV === "tests" }))

const citizenRoutes = require("../routes/citizenRouter")
app.use("/", citizenRoutes)

app.get("/", function (req, res) {
    return res.send('<p>API for BlockCovid (Group 6)</p>').status(200)
});

app.listen(process.env.PORT || 5000, () => {
    if(process.env.NODE_ENV === "dev") console.log("Server is running!")
});

module.exports = app