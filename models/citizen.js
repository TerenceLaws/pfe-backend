const mongoose = require("../src/mongodb")

const citizenSchema = new mongoose.Schema({})

citizenSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Citizen', citizenSchema)