const mongoose = require("../src/mongodb")

const qrCodeSchema = new mongoose.Schema({
    doctor_id: {type: mongoose.ObjectId, ref: 'Doctor'},
    location_id: {type: mongoose.ObjectId, ref: 'Location'}
})

qrCodeSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('QrCode', qrCodeSchema)