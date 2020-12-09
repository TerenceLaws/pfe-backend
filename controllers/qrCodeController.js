const QRCode = require("../models/qrCode")
const Location = require("../models/location")
const Scan = require("../models/scan")
const mongoose = require("mongoose")

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
        return
    })
}

const logScan = (req, res) => {
    const citizenId = req.body.citizen_id
    const qrcodeId = req.body.qrcode_id
    const scan_date = req.body.scan_date || Date.now()

    Scan.find({
        citizen_id: citizenId,
        qrcode_id: qrcodeId
    })
    .sort("exit_date")
    .limit(1)
    .exec()
    .then(result => {
        if (result.length !== 0)
            if (!result[0].hasOwnProperty("exit_date") || result[0].exit_date === null)
                return Scan.updateOne({id: result[0].id}, {exit_date: scan_date})

        return new Scan({
            id: req.body.id || mongoose.Types.ObjectId(),
            citizen_id: citizenId,
            qrcode_id: qrcodeId,
            entry_date: scan_date
        }).save()
    })
    .then(() => {
        res.sendStatus(200)
    })
    .catch(err => {
        if(process.env.NODE_ENV === "dev") console.error(err)
        console.log("GOT AN ERROR IN LOGSCAN", err)
        res.sendStatus(500)
    })
}

const notifyRisk = (req, res) => {
    const limitDate = new Date(new Date().getTime() - (10 * 24 * 60 * 60 * 1000))
    let infected_scans = new Map() //"qrcode_id", [[enter_date, exit_date], [enter_date, exit_date]]

    Scan
    .find({
        citizen_id: req.body.citizen_id,
        entry_date: { $gte: limitDate}
    })
    .exec()
    .then(result => {
        if(result.length <= 0) return

        let data
        for(let scan in result){
            if(scan !== undefined
                || !scan.hasOwnProperty("qrcode_id")
                || !scan.hasOwnProperty("qrcode_id")
                || !scan.hasOwnProperty("entry_date")
                || !scan.hasOwnProperty("exit_date")) continue

            if(infected_scans.has(scan.qrcode_id)) {
                data = infected_scans.get(scan.qrcode_id)
                data.push([scan.entry_date, scan.exit_date])
            } else {
                data = [[scan.entry_date, scan.exit_date]]
            }

            infected_scans.set(scan.qrcode_id, data)
            console.log("Added data to infected_scans", scan.qrcode_id, data, infected_scans.get(scan.qrcode_id))
        }

        return Scan.find({
            qrcode_id: { $in: Array.from(infected_scans.keys())},
            citizen_id: { $ne: req.body.citizen_id},
            exit_date: { $gte: limitDate}
        }).exec()
    })
    .then(result => {
        console.log("All potential victims that scanned a dangerous QR Code", result)

        //for(victim_id in result)
        // if(crossedPaths())

        res.sendStatus(200)
    })
    .catch(err => {
        if(process.env.NODE_ENV === "dev") console.error(err)
        console.log("GOT AN ERROR IN NOTIFY RISK", err)
        res.sendStatus(500)
    })
}

const crossedPaths = (infected_entry, infected_exit, victim_entry, victim_exit) => {
    //infected_entry || infected_exit between(victim_entry, victim_exit)
    return false;
}