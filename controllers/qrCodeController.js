const QrCode = require("../models/qrCode")

/*
 * qr_code_list returns all qr codes in db
 * Return: array of JSON objects representing all db qr codes
 */
exports.qrcode_list = function (req, res){
    QrCode.find({}).then(result => {
        return res.json(result)
    })
}
