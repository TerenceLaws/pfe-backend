const FacilityLocation = require("../models/facilityLocation")

/*
 * facility_location_list returns all facility locations in db
 * Return: array of JSON objects representing all db facility locations
 */
exports.facility_location_list = function (req, res){
    FacilityLocation.collection.insert({id: "123", facility_id: "5fc6d4d1767fe53e10ef2390", qr_code_id: "", name: "Table 1", description: "Table pres de la porte"})

    FacilityLocation.find({}).then(result => {
        return res.json(result)
    })
}
