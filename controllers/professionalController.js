const Professional = require("../models/professional")
const bcrypt = require('bcrypt')
const SALT = 10

/*
 * professional_list returns all professionals in db
 * Return: array of JSON objects representing all db professionals
 */
exports.professional_list = function (req, res){
    Professional.find({}).then(result => {
        res.json(result).status(200).end()
    })
}

function hash(password){
    return bcrypt.hash(password, SALT)
}

/*
 * professional_login verifies mail and password received with bcrypt
 * Return: JSON of professional if authenticated, 401 otherwise
 */
exports.professional_login = function(req, res){
    Professional.find({mail: req.body.mail}).then(result => {
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

exports.professional_register = function(req, res) {
    hash(req.body.password)
        .then(hash => {
            console.log(hash)

            const newProfessional = new Professional({
                name: req.body.name,
                address: req.body.name,
                mail: req.body.mail,
                password: hash,
                is_doctor: req.body.is_doctor
            })

            Professional.collection.insertOne(newProfessional)
            res.sendStatus(200)
        })
        .catch(err => {
            if(process.env.NODE_ENV === "dev") console.error(err)
            res.sendStatus(500)
        })


}

