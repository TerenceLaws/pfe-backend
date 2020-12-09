const mongoose = require("../src/mongodb")

const citizenSchema = new mongoose.Schema({
    id: {type: mongoose.ObjectId, required: [true, 'an ID is required']}
})

citizenSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v
        delete returnedObject._id
    }
})

module.exports = mongoose.model('Citizen', citizenSchema)