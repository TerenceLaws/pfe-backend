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


/*
 * qrcode_insert inserts a new qrcode in db
 * Return: 200 if success
 */
exports.qrcode_insert = function(req, res) {
    let qrcode
    if(req.body.doctor_id == null){
        qrcode = {location_id: req.body.location_id}
    } else {
        qrcode = {doctor_id: req.body.doctor_id}
    }

    new QrCode({qrcode})
        .save()
        .then(() => {
            res.sendStatus(200)
        })
        .catch(err => {
            if (process.env.NODE_ENV === "dev") console.error(err)
            res.sendStatus(500)
        })


}
