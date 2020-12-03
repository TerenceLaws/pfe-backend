const FacilityLocation = require("../models/facilityLocation")

/*
 * facility_location_list returns all facility locations in db
 * Return: array of JSON objects representing all db facility locations
 */
exports.facility_location_list = function (req, res){
    FacilityLocation.find({}).then(result => {
        return res.json(result)
    })
}

exports.pro_loc_add = function (req, res) {
    // create new Location w/ params
    // create new QR Code, w/ Location & params
}