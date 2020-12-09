const mongoose = require("../src/mongodb")

const qrCodeSchema = new mongoose.Schema({
    id: {type: mongoose.ObjectId, required: [true, 'an ID is required']},
    doctor_id: {type: mongoose.ObjectId, ref: 'Doctor'},
    location_id: {type: mongoose.ObjectId, ref: 'Location'}
})

qrCodeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v
        delete returnedObject._id
    }
})

module.exports = mongoose.model('QrCode', qrCodeSchema)