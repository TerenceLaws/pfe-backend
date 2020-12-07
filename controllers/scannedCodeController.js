const ScannedCode = require("../models/scannedCode")

/*
 * scanned_code_list returns all scanned codes in db
 * Return: array of JSON objects representing all db scanned codes
 */
exports.scanned_code_list = function (req, res){
    ScannedCode.find({})
        .then(result => {
            res.json(result).status(200).end()
        })
        .catch(err => {
            if(process.env.NODE_ENV === "dev") console.error(err)
            res.sendStatus(500)
        })
}

/*
 * scanned_code_insert either
 *  1) There ain't any scanned codes for today => simply insert a new scanned code
 *  2) There is already a scanned code for today => If timestamp_enter === timestamp_exit, replace timestamp_exit with Date.now()
 */
exports.scanned_code_insert = function (req, res) {

}
