const Facility = require("../models/facility")

/*
 * facility_list returns all facilities in db
 * Return: array of JSON objects representing all db facilities
 */
exports.facility_list = function (req, res){
    Facility.find({}).then(result => {
        return res.json(result)
    })
}

/*
 * TODO
 */
exports.facility_login = function(req, res){
    console.log(req)
}
