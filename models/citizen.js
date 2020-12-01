const mongoose = require("../src/mongodb")
const uuid = require("uuid").v4;

const citizenSchema = new mongoose.Schema({
    id: { type: String, default: uuid()},
    creation_date: {type: Date, default: Date.now()}
})

citizenSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Citizen', citizenSchema)