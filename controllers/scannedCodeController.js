const ScannedCode = require("../models/scannedCode")

/*
 * scanned_code_list returns all scanned codes in db
 * Return: array of JSON objects representing all db scanned codes
 */
exports.scanned_code_list = function (req, res){
    ScannedCode.find({}).then(result => {
        res.json(result).status(200).end()
    })
}

/*
 * scanned_code_insert inserts a new scannedcode in db
 * Return: 200 if success
 */
exports.scanned_code_insert = function (req, res) {
    new ScannedCode(
        {
            citizen_id: req.body.citizen_id,
            qrcode_id: req.body.qrcode_id,
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
