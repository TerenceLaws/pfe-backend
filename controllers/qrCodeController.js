const QRCode = require("../models/qrCode")
const Location = require("../models/location")
const Scan = require("../models/scan")
const mongoose = require("mongoose")
const notification_controller = require("./notificationController")

require('dotenv').config()

/*
 * qr_code_list returns all qr codes in db
 * Return: array of JSON objects representing all db qr codes
 */
exports.qrcode_list = function (req, res){
    QRCode.find({}).exec().then(result => {
        return res.json(result).status(200).end()
    })
}

/*
 * qrcode_insert inserts a new qrcode in db
 * Return: 200 if success
 */
exports.qrcode_insert = function(req, res) {
    new QRCode({
        id: req.body.id || mongoose.Types.ObjectId(),
        doctor_id: (req.body.doctor_id || null),
        location_id: (req.body.location_id || null)
    })
    .save()
    .then(() => {
        res.sendStatus(200)
    })
    .catch(err => {
        if (process.env.NODE_ENV === "dev") console.error(err)
        res.sendStatus(500)
    })
}

/*
 * qrcode_find_by_facility_id lists all QR codes linked to a facilitie's id
 * Gets the id from the link
 * Return: array of JSON with all the QR Codes or empty if there's none
 */
exports.qrcode_find_by_facility_id = function(req, res) {
    let facilityQRCodes = []
    let locationsIds = []

    // Get all location linked to the facility_id we received
    Location.find({facility_id: req.params.id}).exec()
        .then(result => {
            if(result.length === 0) {
                res.json([]).status(200).end()
            } else {
                for(let i = 0; i < result.length; i++) {
                    locationsIds.push(result[i].id)
                }
                // Find all qrcode in the facility based on their location_id
                QRCode.find({'location_id': { $in: locationsIds }}).exec().then(qrcode => {
                    if(qrcode.length !== 0) {
                        for (let j = 0; j < qrcode.length; j++) {
                            facilityQRCodes.push(qrcode[j])
                        }
                    }
                    if(facilityQRCodes.length === 0) res.json([]).status(200).end()
                    else res.json(facilityQRCodes).status(200).end()
                })
                    .catch(err => {
                        if(process.env.NODE_ENV === "dev") console.error(err)
                        res.sendStatus(500)
                    })
            }
        })
        .catch(err => {
            if(process.env.NODE_ENV === "dev") console.error(err)
            res.sendStatus(500)
        })
}

/*
 * qrcode_scan scans a QR Code, and either
 *  1) DOCTOR-MADE QR: Notifies everyone that got in contact w/ this patient that tested positive
 *  2) NON-DOCTOR QR:  Adds a new entry to scannedcodes notifying citizen_id scanned a code.
 */
exports.qrcode_scan = function (req, res) {
    const qrcodeId = req.body.qrcode_id

    // Check if the qr codes is a doctor's one or a facility's one
    QRCode.find({id: qrcodeId}).exec()
    .then(result => {
        if (result.length > 0 && result[0].doctor_id !== undefined && result[0].doctor_id !== null)
            notifyRisk(req, res)
        else
            logScan(req, res)
    })
    .catch(err => {
        if (process.env.NODE_ENV === "dev") console.error(err)
        console.log("GOT AN ERROR IN SCAN!")
        res.sendStatus(500)
    })
}

const logScan = (req, res) => {
    const citizenId = req.body.citizen_id
    const qrcodeId = req.body.qrcode_id
    const scan_date = (req.body.entry_date !== undefined) ? new Date(req.body.entry_date) : Date.now()

    console.log(scan_date)

    Scan.find({
        citizen_id: citizenId,
        qrcode_id: qrcodeId
    })
    .sort("exit_date")
    .exec()
    .then(lastScan => {
        QRCode.find({id: qrcodeId}).exec().then(result => {
            Location.find({id: result[0].location_id}).exec().then(result => {
                const default_exit = addEnumToDate(scan_date, result[0].max_time)

                // Only update exit_time if lastScan date is BEFORE maxTimeAllowed
                if (lastScan.length !== 0 && scan_date < default_exit)
                    return Scan.updateOne({id: lastScan[0].id}, {exit_date: scan_date})

                return new Scan({
                    id: req.body.id || mongoose.Types.ObjectId(),
                    citizen_id: citizenId,
                    qrcode_id: qrcodeId,
                    entry_date: scan_date,
                    exit_date: default_exit
                }).save()
            })
        })
    })
    .then(() => {
        res.sendStatus(200)
    })
    .catch(err => {
        if (process.env.NODE_ENV === "dev") console.error(err)
        res.sendStatus(500)
    })
}

const addEnumToDate = (date, value) => {
    switch(value){
        case "15m":
            return new Date(date.getTime() + 900000)
        case "30m":
            return new Date(date.getTime() + 1800000)
        case "1h":
            return new Date(date.getTime() + 3600000)
        case "2h":
            return new Date(date.getTime() + 7200000)
        case "5h":
            return new Date(date.getTime() + 18000000)
    }
}

const notifyRisk = (req, res) => {
    const limitDate = (req.body.entry_date !== undefined) ? new Date(new Date(req.body.entry_date).getTime() - (10 * 24 * 60 * 60 * 1000)) : new Date(new Date().getTime() - (10 * 24 * 60 * 60 * 1000))
    let infected_scans = new Map() //"qrcode_id", [[enter_date, exit_date], [enter_date, exit_date]]

    // Get all QR codes that the positive citizen has scanned in the last 10 days
    Scan
    .find({
        citizen_id: req.body.citizen_id,
        entry_date: { $gte: limitDate}
    })
    .exec()
    .then(result => {
        if(result.length <= 0) return

        let data
        for(let i=0; i<result.length; i++){
            let scan = result[i]

            if(infected_scans.has(scan.qrcode_id)) {
                data = infected_scans.get(scan.qrcode_id)
                data.push([scan.entry_date, scan.exit_date])
            } else {
                data = [[scan.entry_date, scan.exit_date]]
            }

            infected_scans.set(scan.qrcode_id.toString(), data)
        }

        // Get every citizen that scanned the same QR codes in the past 10 days.
        return Scan.find({
            qrcode_id: { $in: Array.from(infected_scans.keys())},           // All qrcodes that have been scanned by positive citizen
            citizen_id: { $ne: req.body.citizen_id},                        // that are NOT scanned by that positive citizen
            entry_date: { $gte: limitDate}                                  // which have been scanned in the past 10 days
        }).exec()
    })
    .then(result => {
        if(result === undefined) return res.status(200).end()

        let to_notify = new Set()
        for(let i=0; i<result.length; i++) {
            const scan = result[i]
            const qrcodeIdS = scan.qrcode_id.toString()

            if(infected_scans.has(qrcodeIdS) && crossedPaths(scan, infected_scans.get(qrcodeIdS)))
                to_notify.add(scan.citizen_id)

        }

        if(process.env.NODE_ENV !== "tests")
            to_notify.forEach(citizen_id =>  notification_controller.notify(citizen_id));

        res.status(200).end()
    })
    .catch(err => {
        if(process.env.NODE_ENV === "dev") console.error(err)
        console.log("GOT AN ERROR IN NOTIFY RISK", err)
        res.sendStatus(500)
    })
}

const crossedPaths = (contact_scan, possible_contact_timestamps) => {
    const contact_entry = contact_scan.entry_date
    const contact_exit = contact_scan.exit_date

    for(let i=0; i<possible_contact_timestamps.length; i++){
        const sick_entry = possible_contact_timestamps[i][0]
        let sick_exit = possible_contact_timestamps[i][1]

        // if sick_exit is null, sick_entry + max_time

        if(contact_entry && (contact_entry.getTime() >= sick_entry.getTime() && contact_entry.getTime() <= sick_exit.getTime())
            || contact_exit && (contact_exit.getTime() >= sick_entry.getTime() && contact_exit.getTime() <= sick_exit.getTime())) return true
    }

    return false;
}
