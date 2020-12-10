const Scan = require("../models/scan")
const QRCode = require("../models/qrCode")
const Location = require("../models/location")
const schedule = require('node-schedule')

/*
 * scanned_code_list returns all scanned codes in db
 * Return: array of JSON objects representing all db scanned codes
 */
exports.scanned_code_list = function (req, res){
    Scan.find({})
        .then(result => {
            res.json(result).status(200).end()
        })
        .catch(err => {
            if(process.env.NODE_ENV === "dev") console.error(err)
            res.sendStatus(500)
        })
}

let updateExitDatesMidnight = schedule.scheduleJob('0 0 * * *', () => {

    // Get all scanned codes to check if there are some without an exit date to update it
    Scan.find({}).exec().then(scans => {
        for(let i = 0; i < scans.length(); i++) {
            if(scans[i].exit_date === null) {
                let avg_time
                let new_exit_date

                // Find the qrcode to get its location
                QRCode.find({id: scans[i].qrcode_id}).exec()
                    .then(qrcode => {
                        return Location.find({id: qrcode[0].location_id}).exec()
                    })
                    // Get the avg_time of this location
                    .then(location => {
                        avg_time = location[0].avg_time
                        return Scan.find({id: scans[i].id}).exec()
                    })
                    // Update the scan's exit_time to entry_date + avg_time
                    .then(scan => {
                        new_exit_date = Location.addEnumToDate(scan[0].entry_date, avg_time)
                        Scan.updateOne({id: scan[0].id}, {exit_date: new_exit_date})
                    })
                    .catch(err => {
                        if(process.env.NODE_ENV === "dev") console.error(err)
                    })
                console.log("updated !")
            }
        }
    })
    .catch(err => {
        if(process.env.NODE_ENV === "dev") console.error(err)
    })
})

