const Scan = require("../models/scan")

/*
 * scanned_code_list returns all scanned codes in db
 * Return: array of JSON objects representing all db scanned codes
 */
exports.scanned_code_list = function (req, res){
    Scan.find({}).exec()
    .then(result => {
        res.json(result).status(200).end()
    })
    .catch(err => {
        if(process.env.NODE_ENV === "dev") console.error(err)
        res.sendStatus(500)
    })
}