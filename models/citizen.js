const mongoose = require("../src/mongodb")

const citizenSchema = new mongoose.Schema({
    id: {type: mongoose.ObjectId, required: [true, 'an ID is required']},
    subscription: {type: String, default: null}
})

module.exports = mongoose.model('Citizen', citizenSchema)