const mongoose = require("../src/mongodb")

const professionalSchema = new mongoose.Schema({
    id: {type: mongoose.ObjectId, required: [true, 'an ID is required']},
    name: {type: String, required: [true, 'a name is required']},
    address: {type: String, required: [true, 'an address is required']},
    mail: {type: String, required: [true, 'an email address is required']},
    password: {type: String, required: [true, 'a password is required']},
    is_doctor: {type: Boolean, default: false}
})

professionalSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v
        delete returnedObject._id
    }
})

module.exports = mongoose.model('Facility', professionalSchema)