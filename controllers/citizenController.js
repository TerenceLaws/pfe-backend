const Citizen = require("../models/citizen")

/*
 * citizen_list returns all citizens in db
 * Return: array of JSON objects representing all db citizens
 */
exports.citizen_list = function (req, res){
    Citizen.find({}).then(result => {
        return res.json(result)
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
        .catch(error => {
            console.log("Error during create_citizen", error)
            res.status(400).end()
        })
}