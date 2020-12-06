const QRCode = require("../models/qrCode")
const Location = require("../models/location")

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

exports.qrcode_find_by_facility_id = function(req, res) {
 //TODO
}