const FacilityLocation = require("../models/location")

/*
 * location_list returns all facility locations in db
 * Return: array of JSON objects representing all db facility locations
 */
exports.location_list = function (req, res){
    FacilityLocation.find({})
        .then(result => {
            return res.json(result).status(200).end()
        })
        .catch(err => {
            console.log("Error during location_list", err)
            res.sendStatus(400)
        })
}

/*
 * location_create returns all locations in db
 * Return: the created Location
 */
exports.location_create = function (req, res) {
    // create new Location w/ params
    // create new QR Code, w/ Location & params
    // return this location
}