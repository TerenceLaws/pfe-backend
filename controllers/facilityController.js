const Facility = require("../models/facility")
const bcrypt = require('bcrypt')
const SALT = 10

/*
 * facility_list returns all facilities in db
 * Return: array of JSON objects representing all db facilities
 */
exports.facility_list = function (req, res){
    Facility.find({}).then(result => {
        return res.json(result)
    })
}

function hash(password){
    return bcrypt.hash(password, SALT)
}

/*
 * facility_login verifies mail and password received with bcrypt
 * Return: JSON of facility if authenticated, 401 otherwise
 */
exports.facility_login = function(req, res){
     Facility.find({mail: req.body.mail}).then(result => {
         if (result.length === 0) {
             console.log("mail not in db")
             res.sendStatus(401)
         } else {
             bcrypt.compare(req.body.password, result[0].password)
                 .then(result => {
                     console.log(result)
                     if(!result) {
                         console.log("wrong password")
                         res.sendStatus(401)
                     } else {
                         console.log("authenticated !")
                         res.json(result).status(200).end()
                     }
                })
                 .catch(err => {
                     if(process.env.NODE_ENV === "dev") console.error(err)
                     res.sendStatus(500)
                 })
         }
     })
}

exports.facility_register = function(req, res) {
    hash(req.body.password)
        .then(hash => {
            console.log(hash)

            const newFacility = new Facility({
                name: req.body.name,
                address: req.body.name,
                mail: req.body.mail,
                password: hash
            })

            Facility.collection.insertOne(newFacility)
            res.sendStatus(200)
        })
        .catch(err => {
            if(process.env.NODE_ENV === "dev") console.error(err)
            res.sendStatus(500)
        })


}

