const mongoose = require("../src/mongodb")

const doctorSchema = new mongoose.Schema({
    name: {type: String, required: [true, 'a name is required']},
    address: {type: String, required: [true, 'an address is required']},
    mail: {type: String, required: [true, 'an email address is required']},
    password: {type: String, required: [true, 'a password is required']}
})

doctorSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Doctor', doctorSchema)