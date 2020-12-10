const FacilityLocation = require("../models/location")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

/*
 * location_list returns all facility locations in db
 * Return: array of JSON objects representing all db facility locations
 */
exports.location_list = function (req, res){
    FacilityLocation.find({}).exec()
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
        id: req.body.id || mongoose.Types.ObjectId(),
        facility_id: req.body.facility_id,
        name: req.body.name,
        description: req.body.description,
        max_time: req.body.max_time
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

/*
 * location_list returns all facility locations in db
 * Return: array of JSON objects representing all db facility locations
 */
exports.location_list_by_facility_id = function (req, res){
    let token= req.headers.authorization;
    let decodedToken = jwt.verify(token,"My_secret_jwt_token")
    const facility_id = decodedToken.id;
    FacilityLocation.find({facility_id : facility_id})
        .then(result => {
            return res.json(result).status(200).end()
        })
        .catch(err => {
            console.log("Error during location_list", err)
            res.sendStatus(400)
        })
}