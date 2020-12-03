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
