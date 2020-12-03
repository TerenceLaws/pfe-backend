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
 * location_create creates a new location
 * Return: the created Location
 */
exports.location_create = function (req, res) {
    new FacilityLocation({
        facility_id: req.body.facility_id,
        name: req.body.name,
        description: req.body.description,
        interval: req.body.interval
    })
    .save()
    .then(location => {
        return res.json(location).status(200).end()
    })
    .catch(err => {
        console.log("Error during location_create", err)
        res.sendStatus(400)
    })
}