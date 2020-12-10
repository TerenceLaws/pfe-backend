const Professional = require("../models/professional")
const mongoose = require("mongoose")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const SALT = 10

/*
 * professional_list returns all professionals in db
 * Return: array of JSON objects representing all db professionals
 */
exports.professional_list = function (req, res){
    Professional.find({}).select('-__v -password -_id').exec().then(result => {
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
    Professional.find({mail: req.body.mail}).select("-__v -_id").exec()
        .then(result => {

             if (result.length === 0) {
                 res.sendStatus(401)
             } else {
                 bcrypt.compare(req.body.password, result[0].password)
                     .then(compareResult => {
                         if(!compareResult) {
                             res.sendStatus(401)
                         } else {
                             const resultTest = result[0].id
                             console.log(resultTest)
                             const token =jwt.sign(
                                 {"id": resultTest},
                                 "My_secret_jwt_token",
                                 {expiresIn: '24h'}
                             )
                             res.status(200).json([
                                 result,
                                 token
                             ])
                         }
                    })
                     .catch(err => {
                         if(process.env.NODE_ENV === "dev") console.error(err)
                         res.sendStatus(500)
                     })
         }
     })
        .catch(err => {
            if(process.env.NODE_ENV === "dev") console.error(err)
            res.sendStatus(500)
        })
}

/*
 * professional_register registers a new professional only if mail isn't already in db
 * Return: status 200 if success, 409 if mail already in db
 */
exports.professional_register = function(req, res) {
    Professional.find({mail: req.body.mail}).exec()
        .then(result => {
            if(result.length !== 0){
                res.sendStatus(409)
            } else {
                hash(req.body.password)
                    .then(hash => {
                        new Professional({
                            id: req.body.id || mongoose.Types.ObjectId(),
                            name: req.body.name,
                            address: req.body.address,
                            mail: req.body.mail,
                            password: hash,
                            is_doctor: req.body.is_doctor
                        })
                        .save()
                        .then(() => {
                            res.sendStatus(200)
                        })
                        .catch(error => {
                            console.log("Error during professional_register", error)
                            res.status(400).end()
                        })
                    })
                    .catch(err => {
                        if (process.env.NODE_ENV === "dev") console.error(err)
                        res.sendStatus(500)
                    })
            }
        })
}

