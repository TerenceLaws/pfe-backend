const Doctor = require("../models/doctor")

/*
 * doctor_list returns all doctors in db
 * Return: array of JSON objects representing all db doctors
 */
exports.doctor_list = function (req, res){
    Doctor.find({}).then(result => {
        return res.json(result)
    })
}

/*
 * TODO
 */
exports.doctor_login = function(req, res){
    console.log(req)
}
