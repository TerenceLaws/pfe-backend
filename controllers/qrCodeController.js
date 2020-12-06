const QRCode = require("../models/qrCode")
const ScannedCode = require("../models/scannedCode")

/*
 * qr_code_list returns all qr codes in db
 * Return: array of JSON objects representing all db qr codes
 */
exports.qrcode_list = function (req, res){
    QRCode.find({}).then(result => {
        return res.json(result)
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
 * qrcode_scan scans a QR Code, and either
 *  1) DOCTOR-MADE QR: Notifies everyone that got in contact w/ this patient that tested positive
 *  2) NON-DOCTOR QR:  Adds a new entry to scannedcodes notifing citizen_id scanned a code.
 */
exports.qrcode_scan = function (req, res){
    QRCode.find({_id: req.body.qrcode_id}).then(result => {
        if(result[0].doctor_id !== null)
            notifyRisk(req, res)
        else if(result[0].location_id !== null)
            logToScannedCodes(req, res)
        else
            res.sendStatus(400)
    })
    .catch(err => {
        if (process.env.NODE_ENV === "dev") console.error(err)
        res.sendStatus(500)
    })
}

const notifyRisk = (req, res) => {
    console.log("NotifyRisk w/", req.body.qrcode_id, req.body.citizen_id)
    res.sendStatus(200)
}

const logToScannedCodes = (req, res) => {
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
}