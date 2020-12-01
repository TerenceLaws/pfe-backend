const mongoose = require("../src/mongodb")
const uuid = require("uuid").v4;

const doctorSchema = new mongoose.Schema({
    id: { type: String, default: uuid()},
    name: String,
    address: String,
    mail: String,
    password: String
})

doctorSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Doctor', doctorSchema)