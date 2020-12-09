const ScannedCode = require("../models/scannedCode")
const QRCode = require("../models/qrCode")
const Location = require("../models/location")
const schedule = require('node-schedule')

/*
 * scanned_code_list returns all scanned codes in db
 * Return: array of JSON objects representing all db scanned codes
 */
exports.scanned_code_list = function (req, res){
    ScannedCode.find({})
        .then(result => {
            res.json(result).status(200).end()
        })
        .catch(err => {
            if(process.env.NODE_ENV === "dev") console.error(err)
            res.sendStatus(500)
        })
}

let updateExitTimes = schedule.scheduleJob('0 0 * * *', () => {
    let new_exit_date

    // Get all scanned codes to check if there are some without an exit date to update it
    ScannedCode.find({}).exec().then(scans => {
        for(let i = 0; i < scans.length(); i++) {
            if(scans[i].exit_date === null) {
                // Get the average_time of this scan to update the exit_date
                QRCode.find({qrcode_id: scans[i].qrcode_id}).exec().then(qrcode =>
                    Location.find({id: qrcode[0].location_id}).exec().then(location => {
                        new_exit_date = Location.addEnumToDate(scans[i].entry_date, location[0].avg_time)
                        scans[i].updateOne({id: scans[i].id}, {exit_date: new_exit_date})
                        console.log("Updated !", scans)
                    })
                    .catch(err => {
                        if(process.env.NODE_ENV === "dev") console.error(err)
                    })
                )
                .catch(err => {
                    if(process.env.NODE_ENV === "dev") console.error(err)
                })
            }
        }
    })
    .catch(err => {
        if(process.env.NODE_ENV === "dev") console.error(err)
    })
})