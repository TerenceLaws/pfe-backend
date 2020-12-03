const Citizen = require("../models/citizen")

/*
 * list_citizens returns all citizens in db
 * Return: array of JSON objects representing all db citizens
 */
exports.list_citizens = function (req, res){
    Citizen.find({})
        .then(result => {
            return res.json(result).status(200).end()
        })
        .catch(err => {
            console.log("Error during list_citizens", err)
            res.status(400).end()
        })
}

/*
 * create_citizen creates a new citizen in db
 * Return: 200 if it went well, 400 if not.
 */
exports.create_citizen = function (req, res) {
    new Citizen({})
        .save()
        .then(() => {
            res.status(200).end()
        })
        .catch(err => {
            console.log("Error during create_citizen", err)
            res.status(400).end()
        })
}
