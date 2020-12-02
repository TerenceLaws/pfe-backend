const ScannedCode = require("../models/scannedCode")

/*
 * scanned_code_list returns all scanned codes in db
 * Return: array of JSON objects representing all db scanned codes
 */
exports.scanned_code_list = function (req, res){
    ScannedCode.find({}).then(result => {
        return res.json(result)
    })
}
