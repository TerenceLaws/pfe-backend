const QRCode = require("../models/qrCode")
const Location = require("../models/location")
const ScannedCode = require("../models/scannedCode")

/*
 * qr_code_list returns all qr codes in db
 * Return: array of JSON objects representing all db qr codes
 */
exports.qrcode_list = function (req, res){
    QRCode.find({}).then(result => {
        return res.json(result).status(200).end()
    })
}

/*
 * qrcode_insert inserts a new qrcode in db
 * Return: 200 if success
 */
exports.qrcode_insert = function(req, res) {
    new QRCode({
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
 * qrcode_find_by_facility_id, lists all QR codes linked to a facilitie's id
 * Gets the id from the link
 * Return: array of JSON with all the QR Codes or empty if there's none
 */
exports.qrcode_find_by_facility_id = function(req, res) {
    let facilityQRCodes = []
    let locationsIds = []

    // Get all location linked to the facility_id we received
    Location.find({facility_id: req.params.id})
        .then(result => {
            if(result.length === 0) {
                res.json([]).status(200).end()
            } else {
                for(let i = 0; i < result.length; i++) {
                    locationsIds.push(result[i]._id)
                }
                // Find all qrcode in the facility based on their location_id
                QRCode.find({'location_id': { $in: locationsIds }}).then(qrcode => {
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
 *  2) NON-DOCTOR QR:  Adds a new entry to scannedcodes notifing citizen_id scanned a code.
 */
exports.qrcode_scan = function (req, res){
    QRCode.find({_id: req.body.qrcode_id})
        .then(result => {

            //if(result[0].doctor_id !== undefined && result[0].doctor_id !== null)
                //notifyRisk(req)

            new ScannedCode({
                citizen_id: req.body.citizen_id,
                qrcode_id: req.body.qrcode_id
            })
            .save()
            .then(() => {
                res.sendStatus(200)
            })
            .catch(err => {
                if (process.env.NODE_ENV === "dev") console.error(err)
                res.sendStatus(500)
            })
        })
        .catch(err => {
            if (process.env.NODE_ENV === "dev") console.error(err)
            res.sendStatus(500)
        })
}

const notifyRisk = (req, res) => {
    const limitDate = new Date(new Date().getTime() - (10 * 24 * 60 * 60 * 1000))
    console.log("Date Limite de recherche: ",limitDate)

    let infected_scans = new Map() //"qrcode_id", [[enter_date, exit_date], [enter_date, exit_date]]

    ScannedCode
        .find({
            citizen_id: req.body.citizen_id,
            entry_date: { $gte: limitDate}
        })
        .then(result => {
            let data
            for(let scan in result){
                if(infected_scans.has(scan.qrcode_id)) {
                    data = infected_scans.get(scan.qrcode_id)
                    data.push([scan.entry_date, scan.exit_date])
                } else {
                    data = [[scan.entry_date, scan.exit_date]]
                }

                infected_scans.set(scan.qrcode_id, data)
                console.log("Added data to infected_scans", scan.qrcode_id, data, infected_scans.get(scan.qrcode_id))
            }
        })

    console.log("InfectedScans keys", infected_scans.keys())

    ScannedCode
        .find({
            qrcode_id: { $in: infected_scans.keys()},
            citizen_id: { $ne: req.body.citizen_id},
            exit_date: { $gte: limitDate}
        })
        .then(result => {
            console.log("Result of Find Query on ScannedCodes",result)
            //for(victim_id in result)
            // if(crossedPaths())
        })

    res.sendStatus(200)
}

const crossedPaths = (infected_entry, infected_exit, victim_entry, victim_exit) => {
    //infected_entry || infected_exit between(victim_entry, victim_exit)
    return false;
}