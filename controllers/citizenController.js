const Citizen = require("../models/citizen")
const mongoose = require("mongoose")

/*
 * list_citizens returns all citizens in db
 * Return: array of JSON objects representing all db citizens
 */
exports.list_citizens = function (req, res){
    Citizen.find({}).exec()
        .then(result => {
            return res.json(result).status(200).end()
        })
        .catch(err => {
            console.log("Error during list_citizens", err)
            res.sendStatus(400)
        })
}

/*
 * create_citizen creates a new citizen in db
 * Return: citizen's id + 200 if it went well, 400 if not.
 */
exports.create_citizen = function (req, res) {
    new Citizen({
        id: req.body.id || mongoose.Types.ObjectId()
    })
    .save()
    .then(citizen => {
        res.json(citizen).status(200).end()
    })
    .catch(err => {
        console.log("Error during create_citizen", err)
        res.sendStatus(400)
    })
}
